using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.AntiCheat;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Contests;

public class GetContestViolationsQuery : IRequest<ContestViolationsDto?>
{
    public Guid ContestId { get; set; }
}

internal sealed class GetContestViolationsQueryHandler : AbstractQueryHandler<GetContestViolationsQuery, ContestViolationsDto?>
{
    public GetContestViolationsQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ContestViolationsDto?> Handle(GetContestViolationsQuery request, CancellationToken ct)
    {
        var contest = await DbContext.Contests
            .Where(x => x.Id == request.ContestId)
            .Select(x => new { x.Id, x.Title })
            .FirstOrDefaultAsync(ct);

        if (contest == null)
        {
            return null;
        }

        // Get all registrations for this contest
        List<ContestRegistration> registrations = await DbContext.ContestRegistrations
            .Where(r => r.ContestId == request.ContestId)
            .ToListAsync(ct);

        // Get student names
        List<Guid> studentIds = registrations.Select(r => r.StudentId).Distinct().ToList();
        Dictionary<Guid, string> userDict = await DbContext.Users
            .Where(u => studentIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.UserName ?? "Unknown", ct);

        // Get all violations
        List<AntiCheatViolation> violations = await DbContext.AntiCheatViolations
            .Where(v => v.ContestId == request.ContestId)
            .OrderByDescending(v => v.OccurredAt)
            .ToListAsync(ct);

        Dictionary<Guid, List<AntiCheatViolation>> violationsByStudent = violations
            .GroupBy(v => v.StudentId)
            .ToDictionary(g => g.Key, g => g.ToList());

        List<StudentViolationSummaryDto> students = registrations.Select(r => new StudentViolationSummaryDto
            {
                StudentId = r.StudentId,
                StudentName = userDict.GetValueOrDefault(r.StudentId) ?? "Unknown",
                ViolationCount = r.ViolationCount,
                IsDisqualified = r.IsDisqualified,
                DisqualifiedAt = r.DisqualifiedAt,
                DisqualifiedReason = r.DisqualifiedReason,
                Violations = violationsByStudent.TryGetValue(r.StudentId, out List<AntiCheatViolation>? studentViolations)
                    ? studentViolations.Select(v => new ViolationEntryDto
                    {
                        Id = v.Id,
                        ViolationType = v.ViolationType,
                        Details = v.Details,
                        OccurredAt = v.OccurredAt
                    }).ToList()
                    : []
            })
            .Where(s => s.ViolationCount > 0 || s.IsDisqualified)
            .OrderByDescending(s => s.ViolationCount)
            .ToList();

        return new ContestViolationsDto
        {
            ContestId = contest.Id,
            ContestTitle = contest.Title,
            Students = students
        };
    }
}