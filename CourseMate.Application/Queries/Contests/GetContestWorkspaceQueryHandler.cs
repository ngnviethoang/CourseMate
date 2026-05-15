using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Contests;

public class GetContestWorkspaceQuery : IRequest<ContestWorkspaceDto?>
{
    public Guid ContestId { get; set; }
}

internal sealed class GetContestWorkspaceQueryHandler : AbstractQueryHandler<GetContestWorkspaceQuery, ContestWorkspaceDto?>
{
    public GetContestWorkspaceQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ContestWorkspaceDto?> Handle(GetContestWorkspaceQuery request, CancellationToken ct)
    {
        ContestRegistration? registration = await DbContext.ContestRegistrations
            .FirstOrDefaultAsync(x => x.ContestId == request.ContestId && x.StudentId == CurrentUserId, ct);

        if (registration == null)
        {
            throw new UnauthorizedAccessException("You are not registered for this contest.");
        }

        ContestWorkspaceDto? contest = await DbContext.Contests
            .Where(x => x.Id == request.ContestId)
            .Select(x => new ContestWorkspaceDto
            {
                Id = x.Id,
                Title = x.Title,
                Status = x.Status,
                StartTime = x.StartTime,
                EndTime = x.EndTime,
                DurationInMinutes = x.DurationInMinutes,
                JoinTime = registration.JoinTime,
                AntiCheatLevel = x.AntiCheatLevel,
                MaxViolations = x.MaxViolations,
                ViolationCount = registration.ViolationCount,
                IsDisqualified = registration.IsDisqualified
            }).FirstOrDefaultAsync(ct);

        if (contest == null)
        {
            return null;
        }

        // Check if student can enter yet
        if (contest.Status == ContestStatus.Draft || contest.Status == ContestStatus.Upcoming)
        {
            if (contest.StartTime.HasValue && contest.StartTime.Value > DateTimeOffset.UtcNow)
            {
                throw new InvalidOperationException("Contest hasn't started yet.");
            }
        }

        List<ContestExerciseDto> exercises = await (
            from ce in DbContext.ContestExercises
            join e in DbContext.Exercises on ce.ExerciseId equals e.Id
            where ce.ContestId == request.ContestId
            orderby ce.Order
            select new ContestExerciseDto
            {
                Id = ce.Id,
                ExerciseId = e.Id,
                Title = e.Title,
                Description = e.Description,
                ScoreWeight = ce.ScoreWeight,
                Order = ce.Order,
                BestScore = DbContext.ContestSubmissions
                    .Where(s => s.ContestId == request.ContestId && s.ExerciseId == e.Id && s.StudentId == CurrentUserId)
                    .Max(s => (int?)s.Score),
                IsPassed = DbContext.ContestSubmissions
                    .Any(s => s.ContestId == request.ContestId && s.ExerciseId == e.Id && s.StudentId == CurrentUserId && s.Score == 100),
                Constraints = e.Constraints.ToList(),
                Hints = e.Hints.ToList()
            }).ToListAsync(ct);

        foreach (ContestExerciseDto ex in exercises)
        {
            ex.Examples = await DbContext.ExerciseExamples
                .Where(x => x.ExerciseId == ex.ExerciseId)
                .Select(x => new ExerciseExampleDto
                {
                    Id = x.Id,
                    Input = x.Input,
                    Output = x.Output,
                    Explanation = x.Explanation
                }).ToListAsync(ct);

            ex.DefaultCodes = await DbContext.ExerciseDefaultCodes
                .Where(x => x.ExerciseId == ex.ExerciseId)
                .Select(x => new ExerciseDefaultCodeDto
                {
                    Id = x.Id,
                    Language = x.Language,
                    StarterCode = x.StarterCode
                }).ToListAsync(ct);

            ex.TestCases = await DbContext.ExerciseTestCases
                .Where(x => x.ExerciseId == ex.ExerciseId)
                .OrderBy(x => x.Order)
                .Select(x => new ExerciseTestCaseDto
                {
                    Id = x.Id,
                    Input = x.IsHidden ? "Hidden" : x.Input,
                    ExpectedOutput = x.IsHidden ? "Hidden" : x.ExpectedOutput,
                    Description = x.Description,
                    IsHidden = x.IsHidden,
                    Order = x.Order
                }).ToListAsync(ct);
        }

        contest.Exercises = exercises;

        return contest;
    }
}