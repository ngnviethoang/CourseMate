using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Persistent;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Students;

internal sealed class GetCourseByIdQueryHandler : AbstractQueryHandler<GetCourseByIdQuery, CourseDetailDto?>
{
    public GetCourseByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<CourseDetailDto?> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
    {
        Guid studentId = GetCurrentUserId();

        IQueryable<CourseDetailDto> courseQuery = from course in DbContext.Courses
            join category in DbContext.Categories on course.CategoryId equals category.Id
            join instructor in DbContext.Users on course.InstructorId equals instructor.Id
            where course.Id == request.Id && course.IsPublished
            select new CourseDetailDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Price = course.Price,
                ImageUrl = course.ImageUrl,
                CategoryId = course.CategoryId,
                CategoryName = category.Name,
                InstructorId = course.InstructorId,
                InstructorName = instructor.UserName ?? string.Empty
            };

        CourseDetailDto? result = await courseQuery.FirstOrDefaultAsync(cancellationToken);
        if (result == null)
        {
            return null;
        }

        // Check enrollment
        result.IsEnrolled = await DbContext.Enrollments
            .AnyAsync(e => e.CourseId == request.Id && e.StudentId == studentId, cancellationToken);

        // Fetch Chapters and Lessons
        var chapters = await DbContext.Chapters
            .Where(c => c.CourseId == request.Id)
            .OrderBy(c => c.Position)
            .Select(c => new
            {
                c.Id,
                c.Title,
                c.Position
            })
            .ToListAsync(cancellationToken);

        var lessons = await DbContext.Lessons
            .Where(l => l.CourseId == request.Id)
            .OrderBy(l => l.Position)
            .Select(l => new
            {
                l.Id,
                l.ChapterId,
                l.Title,
                l.LessonType,
                l.Position
            })
            .ToListAsync(cancellationToken);

        List<Guid> lessonIds = lessons.Select(l => l.Id).ToList();

        // Fetch completed lesson IDs for this boolean mapping
        List<Guid> completedLessonIds = [];
        if (studentId != Guid.Empty && lessonIds.Count > 0)
        {
            completedLessonIds = await DbContext.UserLessonProgresses
                .Where(p => p.StudentId == studentId && lessonIds.Contains(p.LessonId) && p.IsCompleted)
                .Select(p => p.LessonId)
                .ToListAsync(cancellationToken);
        }

        // Map Lessons into Chapters
        int totalLessons = lessons.Count;
        int completedLessons = 0;

        foreach (var chapter in chapters)
        {
            ChapterDetailDto chapterDto = new()
            {
                Id = chapter.Id,
                Title = chapter.Title,
                Position = chapter.Position,
                Lessons = lessons
                    .Where(l => l.ChapterId == chapter.Id)
                    .Select(l =>
                    {
                        bool isCompleted = completedLessonIds.Contains(l.Id);
                        if (isCompleted)
                        {
                            completedLessons++;
                        }

                        return new LessonDetailDto
                        {
                            Id = l.Id,
                            Title = l.Title,
                            LessonType = l.LessonType,
                            Position = l.Position,
                            IsCompleted = isCompleted
                        };
                    })
                    .ToList()
            };

            result.Chapters.Add(chapterDto);
        }

        if (totalLessons > 0)
        {
            result.ProgressPercentage = Math.Round((double)completedLessons / totalLessons * 100, 2);
        }
        else
        {
            result.ProgressPercentage = 0;
        }

        return result;
    }
}