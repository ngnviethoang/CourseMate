using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class DeleteCourseAbstractCommandHandler : AbstractCommandHandler<DeleteCourseCommand>
{
    public DeleteCourseAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(DeleteCourseCommand request, CancellationToken cancellationToken)
    {
        Course? course = await DbContext.Courses
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (course == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        DbContext.Remove(course);
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}