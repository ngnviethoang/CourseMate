using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Exercises;

public class DeleteExerciseCommand : IRequest<int>
{
    public Guid Id { get; set; }
}

internal sealed class DeleteExerciseCommandHandler : AbstractCommandHandler<DeleteExerciseCommand, int>
{
    public DeleteExerciseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor) { }

    public override async Task<int> Handle(DeleteExerciseCommand request, CancellationToken cancellationToken)
    {
        Exercise? exercise = await DbContext.Exercises
            .WhereIf(IsInRole(Roles.Instructor), x => x.CreatedById == CurrentUserId)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (exercise is null)
            throw new EntityNotFoundException(nameof(Exercise), request.Id);

        DbContext.Exercises.Remove(exercise); // soft-delete via ISoftDelete
        return await DbContext.SaveChangesAsync(cancellationToken);
    }
}
