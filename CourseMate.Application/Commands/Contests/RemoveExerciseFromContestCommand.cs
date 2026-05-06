using CourseMate.Application.Shared;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Contests;

public class RemoveExerciseFromContestCommand : IRequest<Unit>
{
    public Guid ContestId { get; set; }
    public Guid ContestExerciseId { get; set; }
}

internal sealed class RemoveExerciseFromContestCommandHandler : AbstractCommandHandler<RemoveExerciseFromContestCommand, Unit>
{
    public RemoveExerciseFromContestCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(RemoveExerciseFromContestCommand request, CancellationToken ct)
    {
        ContestExercise? ce = await DbContext.ContestExercises
            .FirstOrDefaultAsync(x => x.Id == request.ContestExerciseId && x.ContestId == request.ContestId, ct);

        if (ce == null)
        {
            throw new KeyNotFoundException("Exercise not found in this contest.");
        }

        DbContext.ContestExercises.Remove(ce);
        await DbContext.SaveChangesAsync(ct);

        return Unit.Value;
    }
}