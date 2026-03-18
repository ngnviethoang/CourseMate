using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class DeleteLessonCommandHandler : IRequestHandler<DeleteLessonCommand>
{
    private readonly CourseMateDbContext _dbContext;

    public DeleteLessonCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(DeleteLessonCommand request, CancellationToken cancellationToken)
    {
        Lesson? lesson = await _dbContext.Lessons.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (lesson == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        _dbContext.Remove(lesson);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}