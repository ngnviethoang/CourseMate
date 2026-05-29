using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Lessons;

public class GetLessonByIdQuery : IRequest<LessonDto?>
{
    public Guid Id { get; set; }
}

public sealed class GetLessonByIdQueryHandler : AbstractQueryHandler<GetLessonByIdQuery, LessonDto?>
{
    public GetLessonByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<LessonDto?> Handle(GetLessonByIdQuery request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        IQueryable<LessonDto> query = from lesson in DbContext.Lessons
            join chapter in DbContext.Chapters on lesson.ChapterId equals chapter.Id
            join course in DbContext.Courses on lesson.CourseId equals course.Id
            where lesson.Id == request.Id
            select new LessonDto
            {
                Id = lesson.Id,
                ChapterId = lesson.ChapterId,
                ChapterName = chapter.Title,
                CourseId = lesson.CourseId,
                InstructorId = course.InstructorId,
                CourseName = course.Title,
                Title = lesson.Title,
                LessonType = lesson.LessonType,
                Position = lesson.Position
            };

        LessonDto? lessonItem = await query
            .WhereIf(IsInRole(Roles.Instructor), i => i.InstructorId == userId)
            .FirstOrDefaultAsync(ct);

        if (lessonItem == null)
        {
            return null;
        }

        await EnsureEnrollmentAsync(lessonItem.CourseId);

        List<Guid> lessonOrder = await DbContext.Lessons
            .Where(x => x.ChapterId == lessonItem.ChapterId)
            .OrderBy(x => x.Position)
            .Select(x => x.Id)
            .ToListAsync(ct);

        int sortOrder = lessonOrder.FindIndex(x => x == lessonItem.Id) + 1;

        lessonItem.SortOrder = sortOrder < 1 ? 1 : sortOrder;
        return lessonItem;
    }
}