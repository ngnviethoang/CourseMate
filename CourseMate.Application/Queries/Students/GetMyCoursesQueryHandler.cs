using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Contracts.Enums;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Students;

internal sealed class GetMyCoursesQueryHandler : AbstractQueryHandler<GetMyCoursesQuery, PagedDto<StudentMyCourseDto>>
{
    public GetMyCoursesQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<StudentMyCourseDto>> Handle(GetMyCoursesQuery request, CancellationToken cancellationToken)
    {
        Guid studentId = GetCurrentUserId();

        // Get course IDs for this student (as a sub-query)
        var orderedCourseIds = DbContext.Orders
            .Where(o => o.StudentId == studentId && o.Status == OrderStatus.Paid)
            .Join(DbContext.OrderItems, o => o.Id, oi => oi.OrderId, (o, oi) => oi.CourseId);

        var enrolledCourseIds = DbContext.Enrollments
            .Where(e => e.StudentId == studentId)
            .Select(e => e.CourseId);

        var myCourseIdsQuery = orderedCourseIds.Union(enrolledCourseIds);

        // Fetch courses, counts, and progress
        var query = from course in DbContext.Courses
            join category in DbContext.Categories on course.CategoryId equals category.Id
            join instructor in DbContext.Users on course.InstructorId equals instructor.Id
            where myCourseIdsQuery.Contains(course.Id)
            select new StudentMyCourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Price = course.Price,
                ImageUrl = course.ImageUrl,
                IsPublished = course.IsPublished,
                CategoryId = course.CategoryId,
                CategoryName = category.Name,
                InstructorId = course.InstructorId,
                InstructorName = instructor.UserName,
                CreationTime = course.CreationTime,
                LastModificationTime = course.LastModificationTime
            };

        if (!string.IsNullOrEmpty(request.Filter))
        {
            query = query.Where(x => x.Title.Contains(request.Filter));
        }

        query = request.Sorting switch
        {
            "title" => query.OrderBy(x => x.Title),
            "title_desc" => query.OrderByDescending(x => x.Title),
            _ => query.OrderByDescending(x => x.CreationTime)
        };

        int total = await query.CountAsync(cancellationToken);

        List<StudentMyCourseDto> courses = await query
            .Paged(request.PageIndex, request.PageSize)
            .ToListAsync(cancellationToken);

        // Fill progress metrics
        foreach (var course in courses)
        {
            int totalLessons = await DbContext.Lessons.CountAsync(l => l.CourseId == course.Id, cancellationToken);
            
            // Join with Lessons to filter progresses by CourseId since UserLessonProgress doesn't have CourseId
            int completedLessons = await DbContext.UserLessonProgresses
                .Join(DbContext.Lessons, p => p.LessonId, l => l.Id, (p, l) => new { p.StudentId, l.CourseId, p.IsCompleted })
                .CountAsync(x => x.StudentId == studentId && x.CourseId == course.Id && x.IsCompleted, cancellationToken);

            course.TotalLessons = totalLessons;
            course.CompletedLessons = completedLessons;
            course.ProgressPercentage = totalLessons > 0 
                ? Math.Round((double)completedLessons / totalLessons * 100, 2) 
                : 0;

            // Fetch last lesson title (the one with the latest progress record)
            var lastLessonProgress = await DbContext.UserLessonProgresses
                .Join(DbContext.Lessons, p => p.LessonId, l => l.Id, (p, l) => new { p.StudentId, l.CourseId, l.Title, p.LastModificationTime })
                .Where(x => x.StudentId == studentId && x.CourseId == course.Id)
                .OrderByDescending(x => x.LastModificationTime)
                .Select(x => x.Title)
                .FirstOrDefaultAsync(cancellationToken);

            course.LastLessonTitle = lastLessonProgress;
        }

        return new PagedDto<StudentMyCourseDto>
        {
            Items = courses,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = total
        };
    }
}
