using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
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
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(DeleteExerciseCommand request, CancellationToken ct)
    {
        Exercise? exercise = await DbContext.Exercises
            .WhereIf(IsInRole(Roles.Instructor), x => x.CreatorId == CurrentUserId)
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (exercise is null)
        {
            throw new UnauthorizedAccessException();
        }

        DbContext.Exercises.Remove(exercise);
        return Codes.Success;
    }
}