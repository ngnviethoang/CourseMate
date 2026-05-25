using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.DTOs.Exercises;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Contests;

public class SubmitContestExerciseCommand : IRequest<ResultIdDto>
{
    public Guid ContestId { get; set; }
    public Guid ExerciseId { get; set; }
    public SubmitExerciseRequest Payload { get; set; }
}

internal sealed class SubmitContestExerciseCommandHandler : AbstractCommandHandler<SubmitContestExerciseCommand, ResultIdDto>
{
    public SubmitContestExerciseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(SubmitContestExerciseCommand request, CancellationToken ct)
    {
        // Check registration and status
        ContestRegistration? registration = await DbContext.ContestRegistrations
            .FirstOrDefaultAsync(x => x.ContestId == request.ContestId && x.StudentId == CurrentUserId, ct);

        if (registration == null)
        {
            throw new UnauthorizedAccessException("You are not registered for this contest.");
        }

        if (registration.IsDisqualified)
        {
            throw new BusinessException(ErrorCode.Unknown, "You have been disqualified from this contest.");
        }

        if (registration.SubmitTime.HasValue)
        {
            throw new BusinessException(ErrorCode.Unknown, "You have already submitted your final contest entry.");
        }

        Contest? contest = await DbContext.Contests.FindAsync([request.ContestId], ct);
        if (contest == null || contest.Status != ContestStatus.Ongoing)
        {
            // Allow submission if within duration after JoinTime even if Contest status is Ended?
            // Usually contest ends for everyone at EndTime.
            if (contest?.EndTime.HasValue == true && contest.EndTime.Value < DateTimeOffset.UtcNow)
            {
                throw new BusinessException(ErrorCode.Unknown, "Contest has ended.");
            }
        }

        // Calculate score weight
        ContestExercise? ce = await DbContext.ContestExercises
            .FirstOrDefaultAsync(x => x.ContestId == request.ContestId && x.ExerciseId == request.ExerciseId, ct);

        if (ce == null)
        {
            throw new BusinessException(ErrorCode.Unknown, "Exercise is not part of this contest.");
        }

        // Score in payload is 0-100 percentage
        int weightedScore = (int)(request.Payload.Score / 100f * ce.ScoreWeight);

        ContestSubmission submission = new(
            Guid.NewGuid(),
            request.ContestId,
            request.ExerciseId,
            CurrentUserId,
            request.Payload.Language,
            request.Payload.Code,
            weightedScore,
            (float)request.Payload.TotalTime,
            (int)request.Payload.TotalMemory,
            DateTimeOffset.UtcNow,
            true // For now mark all as final or logic to find best?
        );

        // Logic to maintain IsFinal: only one submission per (Contest, Exercise, Student) should be IsFinal=true (the one with highest score)
        // Actually the leaderboard logic said "Total Score (Sum of max scores per exercise)".
        // So we can just find the max score in the query. IsFinal is just an optimization.

        await DbContext.ContestSubmissions.AddAsync(submission, ct);

        return new ResultIdDto { Id = submission.Id };
    }
}