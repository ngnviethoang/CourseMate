using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class DeleteCourseCommandHandler : IRequestHandler<DeleteCourseCommand>
{
    private readonly CourseMateDbContext _dbContext;

    public DeleteCourseCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(DeleteCourseCommand request, CancellationToken cancellationToken)
    {
        Course? course = await _dbContext.Courses.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (course == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        _dbContext.Remove(course);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}