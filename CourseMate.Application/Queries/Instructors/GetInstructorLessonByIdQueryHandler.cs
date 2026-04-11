using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Instructors;

public class GetInstructorLessonByIdQuery : IRequest<LessonDto?>
{
    public Guid Id { get; set; }
}

internal sealed class GetInstructorLessonByIdQueryHandler
    : AbstractQueryHandler<GetInstructorLessonByIdQuery, LessonDto?>
{
    public GetInstructorLessonByIdQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<LessonDto?> Handle(
        GetInstructorLessonByIdQuery request,
        CancellationToken cancellationToken)
    {
        Guid instructorId = GetCurrentUserId();

        LessonDto? result = await (
            from lesson in DbContext.Lessons
            join chapter in DbContext.Chapters on lesson.ChapterId equals chapter.Id
            join course in DbContext.Courses on lesson.CourseId equals course.Id
            where lesson.Id == request.Id && course.InstructorId == instructorId
            select new LessonDto
            {
                Id = lesson.Id,
                ChapterId = lesson.ChapterId,
                ChapterName = chapter.Title,
                CourseId = lesson.CourseId,
                CourseName = course.Title,
                Title = lesson.Title,
                LessonType = lesson.LessonType,
                Position = lesson.Position,
                CreationTime = lesson.CreationTime,
                LastModificationTime = lesson.LastModificationTime
            }
        ).FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}