using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Admins;

internal sealed class CreateLessonCommandHandler : AbstractCommandHandler<CreateLessonCommand, ResultIdDto>
{
    public CreateLessonCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateLessonCommand request, CancellationToken cancellationToken)
    {
        Lesson lesson = new(
            Guid.NewGuid(),
            request.ChapterId,
            request.CourseId,
            request.Title,
            request.LessonType,
            request.Position
        );

        await DbContext.AddAsync(lesson, cancellationToken);
        return new ResultIdDto { Id = lesson.Id };
    }
}