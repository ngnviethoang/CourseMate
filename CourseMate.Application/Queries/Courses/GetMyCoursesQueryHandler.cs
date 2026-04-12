using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Courses;

public class GetMyCoursesQuery : GetListQuery<StudentMyCourseDto>
{
    public Guid StudentId { get; set; }
}

internal sealed class GetMyCoursesQueryHandler : AbstractQueryHandler<GetMyCoursesQuery, PagedDto<StudentMyCourseDto>>
{
    public GetMyCoursesQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<StudentMyCourseDto>> Handle(GetMyCoursesQuery request, CancellationToken cancellationToken)
    {
        Guid studentId = IsInRole(Roles.Admin) ? request.StudentId : GetCurrentUserId();

        IQueryable<StudentMyCourseDto> query =
            from enrollment in DbContext.Enrollments
            join course in DbContext.Courses on enrollment.CourseId equals course.Id
            join category in DbContext.Categories on course.CategoryId equals category.Id
            join instructor in DbContext.Users on course.InstructorId equals instructor.Id
            where enrollment.StudentId == studentId
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

        query = query.WhereIf(!string.IsNullOrWhiteSpace(request.Filter), x => EF.Functions.ILike(x.Title, $"%{request.Filter}%"));
        query = request.Sorting switch
        {
            "title" => query.OrderBy(x => x.Title),
            "title_desc" => query.OrderByDescending(x => x.Title),
            _ => query.OrderByDescending(x => x.CreationTime)
        };
        List<StudentMyCourseDto> courses = await query.Paged(request.PageIndex, request.PageSize).ToListAsync(cancellationToken);
        int total = await query.CountAsync(cancellationToken);

        List<Guid> courseIds = courses.Select(c => c.Id).ToList();
        if (courseIds.Any())
        {
            Dictionary<Guid, int> totalLessonsDict = await (
                from lesson in DbContext.Lessons
                where courseIds.Contains(lesson.CourseId)
                group lesson by lesson.CourseId
                into grouping
                select new CourseLessonCountDto(grouping.Key, grouping.Count())
            ).ToDictionaryAsync(x => x.CourseId, x => x.Count, cancellationToken);

            Dictionary<Guid, int> completedLessonsDict = await (
                from userLessonProgress in DbContext.UserLessonProgresses
                where userLessonProgress.StudentId == studentId && userLessonProgress.IsCompleted
                join lesson in DbContext.Lessons on userLessonProgress.LessonId equals lesson.Id
                where courseIds.Contains(lesson.CourseId)
                group lesson by lesson.CourseId
                into grouping
                select new CourseLessonCountDto(grouping.Key, grouping.Count())
            ).ToDictionaryAsync(x => x.CourseId, x => x.Count, cancellationToken);

            List<LessonProgressItemDto> lessonProgresses = await (
                from userLessonProgress in DbContext.UserLessonProgresses
                where userLessonProgress.StudentId == studentId
                join lesson in DbContext.Lessons on userLessonProgress.LessonId equals lesson.Id
                where courseIds.Contains(lesson.CourseId)
                select new LessonProgressItemDto(lesson.CourseId, lesson.Title, userLessonProgress.LastModificationTime)
            ).ToListAsync(cancellationToken);

            Dictionary<Guid, string?> lastLessonDict = (
                from lessonProgressItemDto in lessonProgresses
                group lessonProgressItemDto by lessonProgressItemDto.CourseId
                into grouping
                select new CourseLastLessonDto(grouping.Key, grouping
                    .OrderByDescending(item => item.LastModificationTime)
                    .Select(item => item.Title)
                    .FirstOrDefault()
                )
            ).ToDictionary(x => x.CourseId, x => x.LastLessonTitle);

            foreach (StudentMyCourseDto course in courses)
            {
                int totalLessons = totalLessonsDict.GetValueOrDefault(course.Id, 0);
                int completedLessons = completedLessonsDict.GetValueOrDefault(course.Id, 0);

                course.TotalLessons = totalLessons;
                course.CompletedLessons = completedLessons;
                course.ProgressPercentage = totalLessons > 0 ? Math.Round((double)completedLessons / totalLessons * 100, 2) : 0;
                course.LastLessonTitle = lastLessonDict.GetValueOrDefault(course.Id, string.Empty) ?? string.Empty;
            }
        }

        return new PagedDto<StudentMyCourseDto>
        {
            Items = courses,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = total
        };
    }

    private sealed record CourseLessonCountDto(Guid CourseId, int Count);

    private sealed record CourseLastLessonDto(Guid CourseId, string? LastLessonTitle);

    private sealed record LessonProgressItemDto(Guid CourseId, string Title, DateTimeOffset? LastModificationTime);
}