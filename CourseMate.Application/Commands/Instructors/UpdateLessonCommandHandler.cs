using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Instructors;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Instructors;

internal sealed class UpdateLessonAbstractCommandHandler : AbstractCommandHandler<UpdateLessonCommand, int>
{
    public UpdateLessonAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(UpdateLessonCommand request, CancellationToken cancellationToken)
    {
        Lesson? lesson = await DbContext.Lessons.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (lesson == null)
        {
            throw new EntityNotFoundException(nameof(Lesson), request.Id);
        }

        lesson.ChapterId = request.ChapterId;
        lesson.CourseId = request.CourseId;
        lesson.Title = request.Title;
        lesson.LessonType = request.LessonType;
        lesson.Position = request.Position;

        DbContext.Update(lesson);
        return Codes.Success;
    }
}