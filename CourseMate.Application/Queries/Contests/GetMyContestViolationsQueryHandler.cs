using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.AntiCheat;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Contests;

public class GetMyContestViolationsQuery : IRequest<StudentViolationSummaryDto?>
{
    public Guid ContestId { get; set; }
}

internal sealed class GetMyContestViolationsQueryHandler : AbstractQueryHandler<GetMyContestViolationsQuery, StudentViolationSummaryDto?>
{
    public GetMyContestViolationsQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<StudentViolationSummaryDto?> Handle(GetMyContestViolationsQuery request, CancellationToken ct)
    {
        ContestRegistration? registration = await DbContext.ContestRegistrations
            .FirstOrDefaultAsync(r => r.ContestId == request.ContestId && r.StudentId == CurrentUserId, ct);

        if (registration == null)
        {
            return null;
        }

        string studentName = await DbContext.Users
            .Where(u => u.Id == CurrentUserId)
            .Select(u => u.UserName ?? "Unknown")
            .FirstOrDefaultAsync(ct) ?? "Unknown";

        List<AntiCheatViolation> violations = await DbContext.AntiCheatViolations
            .Where(v => v.ContestId == request.ContestId && v.StudentId == CurrentUserId)
            .OrderByDescending(v => v.OccurredAt)
            .ToListAsync(ct);

        return new StudentViolationSummaryDto
        {
            StudentId = CurrentUserId,
            StudentName = studentName,
            ViolationCount = registration.ViolationCount,
            IsDisqualified = registration.IsDisqualified,
            DisqualifiedAt = registration.DisqualifiedAt,
            DisqualifiedReason = registration.DisqualifiedReason,
            Violations = violations.Select(v => new ViolationEntryDto
            {
                Id = v.Id,
                ViolationType = v.ViolationType,
                Details = v.Details,
                OccurredAt = v.OccurredAt
            }).ToList()
        };
    }
}