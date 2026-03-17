using CourseMate.Contract.Constants;
using CourseMate.Contract.DTOs.Admins;
using CourseMate.Contract.Exceptions;
using CourseMate.Core;
using CourseMate.Core.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class UpdateLessonCommandHandler : IRequestHandler<UpdateLessonCommand>
{
    private readonly CourseMateDbContext _dbContext;

    public UpdateLessonCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(UpdateLessonCommand request, CancellationToken cancellationToken)
    {
        Lesson? lesson = await _dbContext.Lessons.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (lesson == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        lesson.ChapterId = request.ChapterId;
        lesson.CourseId = request.CourseId;
        lesson.Title = request.Title;
        lesson.LessonType = request.LessonType;
        lesson.Position = request.Position;

        _dbContext.Update(lesson);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}