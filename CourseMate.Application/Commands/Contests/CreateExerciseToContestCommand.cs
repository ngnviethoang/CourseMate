using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Contests;

public class CreateExerciseToContestCommand : IRequest<ResultIdDto>
{
    public Guid ContestId { get; set; }

    public Guid ExerciseId { get; set; }

    [Range(0, 100)]
    public int ScoreWeight { get; set; }

    [Range(0, int.MaxValue)]
    public int Order { get; set; }
}

internal sealed class CreateExerciseToContestCommandHandler : AbstractCommandHandler<CreateExerciseToContestCommand, ResultIdDto>
{
    public CreateExerciseToContestCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateExerciseToContestCommand request, CancellationToken ct)
    {
        Contest? contest = await DbContext.Contests.FirstOrDefaultAsync(x => x.Id == request.ContestId, ct);
        if (contest == null)
        {
            throw new EntityNotFoundException(nameof(contest), request.ContestId);
        }

        if (!IsInRole(Roles.Admin) && contest.CreatorId != CurrentUserId)
        {
            throw new UnauthorizedAccessException();
        }

        await DbContext.Exercises.EnsureExistsAsync(request.ExerciseId, ct);

        bool alreadyAdded = await DbContext.ContestExercises
            .Where(c => c.ContestId == request.ContestId && c.ExerciseId == request.ExerciseId)
            .AnyAsync(ct);

        if (alreadyAdded)
        {
            throw new BusinessException(ErrorMessages.ExerciseAlreadyAddedToContest);
        }

        bool duplicatedOrder = request.Order != 0 && await DbContext.ContestExercises
            .AnyAsync(x => x.ContestId == request.ContestId && x.Order == request.Order, ct);
        if (duplicatedOrder)
        {
            throw new BusinessException(ErrorMessages.DuplicateExerciseOrder);
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