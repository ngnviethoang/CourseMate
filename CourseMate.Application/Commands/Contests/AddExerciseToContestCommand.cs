using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Contests;

public class AddExerciseToContestCommand : IRequest<ResultIdDto>
{
    public Guid ContestId { get; set; }
    public Guid ExerciseId { get; set; }
    public int ScoreWeight { get; set; }
    public int Order { get; set; }
}

internal sealed class AddExerciseToContestCommandHandler : AbstractCommandHandler<AddExerciseToContestCommand, ResultIdDto>
{
    public AddExerciseToContestCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(AddExerciseToContestCommand request, CancellationToken ct)
    {
        Contest? contest = await DbContext.Contests
            .FirstOrDefaultAsync(x => x.Id == request.ContestId, ct);

        if (contest == null)
        {
            throw new KeyNotFoundException("Contest not found.");
        }

        if (contest.CreatorId != CurrentUserId && !IsInRole("Admin"))
        {
            throw new UnauthorizedAccessException("You are not authorized to modify this contest.");
        }

        // Check if exercise exists
        bool exerciseExists = await DbContext.Exercises.AnyAsync(x => x.Id == request.ExerciseId, ct);
        if (!exerciseExists)
        {
            throw new KeyNotFoundException("Exercise not found.");
        }

        // Check if already added
        bool alreadyAdded = await DbContext.ContestExercises
            .AnyAsync(x => x.ContestId == request.ContestId && x.ExerciseId == request.ExerciseId, ct);

        if (alreadyAdded)
        {
            throw new InvalidOperationException("Exercise already added to this contest.");
        }

        ContestExercise contestExercise = new(
            Guid.NewGuid(),
            request.ContestId,
            request.ExerciseId,
            request.ScoreWeight,
            request.Order
        );

        await DbContext.ContestExercises.AddAsync(contestExercise, ct);
        await DbContext.SaveChangesAsync(ct);

        return new ResultIdDto { Id = contestExercise.Id };
    }
}