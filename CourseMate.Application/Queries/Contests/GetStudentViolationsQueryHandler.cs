using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.AntiCheat;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Contests;

public class GetStudentViolationsQuery : IRequest<StudentViolationSummaryDto?>
{
    public Guid ContestId { get; set; }
    public Guid StudentId { get; set; }
}

internal sealed class GetStudentViolationsQueryHandler : AbstractQueryHandler<GetStudentViolationsQuery, StudentViolationSummaryDto?>
{
    public GetStudentViolationsQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<StudentViolationSummaryDto?> Handle(GetStudentViolationsQuery request, CancellationToken ct)
    {
        ContestRegistration? registration = await DbContext.ContestRegistrations
            .FirstOrDefaultAsync(r => r.ContestId == request.ContestId && r.StudentId == request.StudentId, ct);

        if (registration == null)
        {
            return null;
        }

        string studentName = await DbContext.Users
            .Where(u => u.Id == request.StudentId)
            .Select(u => u.UserName ?? "Unknown")
            .FirstOrDefaultAsync(ct) ?? "Unknown";

        List<AntiCheatViolation> violations = await DbContext.AntiCheatViolations
            .Where(v => v.ContestId == request.ContestId && v.StudentId == request.StudentId)
            .OrderByDescending(v => v.OccurredAt)
            .ToListAsync(ct);

        return new StudentViolationSummaryDto
        {
            StudentId = request.StudentId,
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