using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
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

        if (contest == null)
        {
            return null;
        }

        // 1. Get all submissions for this contest
        List<ContestSubmission> submissions = await DbContext.ContestSubmissions
            .Where(s => s.ContestId == request.ContestId)
            .ToListAsync(ct);

        if (submissions.Count == 0)
        {
            return new ContestLeaderboardDto
            {
                ContestId = contest.Id,
                ContestTitle = contest.Title,
                Entries = []
            };
        }

        // 2. Get unique student IDs and fetch their usernames
        List<Guid> studentIds = submissions.Select(s => s.StudentId).Distinct().ToList();
        Dictionary<Guid, string> userDict = await DbContext.Users
            .Where(u => studentIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.UserName ?? "Unknown", ct);

        // Fetch disqualification status from registrations
        Dictionary<Guid, bool> disqualifiedDict = await DbContext.ContestRegistrations
            .Where(r => r.ContestId == request.ContestId && studentIds.Contains(r.StudentId))
            .ToDictionaryAsync(r => r.StudentId, r => r.IsDisqualified, ct);

        // 3. Process to find best scores per exercise per student
        List<LeaderboardEntryDto> entries = submissions
            .GroupBy(s => s.StudentId)
            .Select(studentGroup =>
            {
                Guid studentId = studentGroup.Key;
                string userName = userDict.GetValueOrDefault(studentId) ?? "Unknown";

                List<ContestSubmission> bestScoresPerExercise = studentGroup
                    .GroupBy(s => s.ExerciseId)
                    .Select(exerciseGroup => exerciseGroup
                        .OrderByDescending(s => s.Score)
                        .ThenBy(s => s.TotalTime)
                        .First())
                    .ToList();

                return new LeaderboardEntryDto
                {
                    StudentId = studentId,
                    StudentName = userName,
                    TotalScore = bestScoresPerExercise.Sum(s => s.Score),
                    TotalRuntime = bestScoresPerExercise.Sum(s => s.TotalTime),
                    LastSubmitTime = bestScoresPerExercise.Max(s => s.CreationTime),
                    IsDisqualified = disqualifiedDict.GetValueOrDefault(studentId, false)
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