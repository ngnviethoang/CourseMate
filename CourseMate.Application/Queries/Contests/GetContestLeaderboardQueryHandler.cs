using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Contests;

public class GetContestLeaderboardQuery : IRequest<ContestLeaderboardDto>
{
    public Guid ContestId { get; set; }
}

internal sealed class GetContestLeaderboardQueryHandler : AbstractQueryHandler<GetContestLeaderboardQuery, ContestLeaderboardDto?>
{
    public GetContestLeaderboardQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ContestLeaderboardDto?> Handle(GetContestLeaderboardQuery request, CancellationToken ct)
    {
        var contest = await DbContext.Contests
            .Where(x => x.Id == request.ContestId)
            .Select(x => new { x.Id, x.Title })
            .FirstOrDefaultAsync(ct);

        if (contest == null) return null;

        // Get all submissions for this contest
        var allSubmissions = await DbContext.ContestSubmissions
            .Where(s => s.ContestId == request.ContestId)
            .Join(DbContext.Users, s => s.StudentId, u => u.Id, (s, u) => new
            {
                s.StudentId,
                u.UserName,
                s.ExerciseId,
                s.Score,
                s.TotalTime,
                s.CreationTime
            })
            .ToListAsync(ct);

        // Process in memory to find best scores per exercise per student
        var entries = allSubmissions
            .GroupBy(s => s.StudentId)
            .Select(studentGroup =>
            {
                var bestScoresPerExercise = studentGroup
                    .GroupBy(s => s.ExerciseId)
                    .Select(exerciseGroup => exerciseGroup.OrderByDescending(s => s.Score).ThenBy(s => s.TotalTime).First())
                    .ToList();

                return new LeaderboardEntryDto
                {
                    StudentId = studentGroup.Key,
                    StudentName = studentGroup.First().UserName ?? "Unknown",
                    TotalScore = bestScoresPerExercise.Sum(s => s.Score),
                    TotalRuntime = bestScoresPerExercise.Sum(s => s.TotalTime),
                    LastSubmitTime = bestScoresPerExercise.Max(s => s.CreationTime)
                };
            })
            .OrderByDescending(e => e.TotalScore)
            .ThenBy(e => e.TotalRuntime)
            .ThenBy(e => e.LastSubmitTime)
            .ToList();

        // Assign ranks
        for (int i = 0; i < entries.Count; i++)
        {
            entries[i].Rank = i + 1;
        }

        return new ContestLeaderboardDto
        {
            ContestId = contest.Id,
            ContestTitle = contest.Title,
            Entries = entries
        };
    }
}
