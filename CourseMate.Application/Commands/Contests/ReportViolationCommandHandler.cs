using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.AntiCheat;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Contests;

public class ReportViolationCommand : IRequest<ViolationResultDto>
{
    public Guid ContestId { get; set; }
    public ViolationType ViolationType { get; set; }
    public string Details { get; set; } = string.Empty;
    public DateTimeOffset Timestamp { get; set; }
}

internal sealed class ReportViolationCommandHandler : AbstractCommandHandler<ReportViolationCommand, ViolationResultDto>
{
    public ReportViolationCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ViolationResultDto> Handle(ReportViolationCommand request, CancellationToken ct)
    {
        ContestRegistration? registration = await DbContext.ContestRegistrations
            .FirstOrDefaultAsync(x => x.ContestId == request.ContestId && x.StudentId == CurrentUserId, ct);

        if (registration == null)
        {
            throw new BusinessException(ErrorCode.Unknown, "You are not registered for this contest.");
        }

        if (registration.IsDisqualified)
        {
            return new ViolationResultDto
            {
                ViolationCount = registration.ViolationCount,
                MaxViolations = 0,
                IsDisqualified = true,
                Message = "You have been disqualified from this contest."
            };
        }

        Contest? contest = await DbContext.Contests.FindAsync([request.ContestId], ct);
        if (contest == null)
        {
            throw new EntityNotFoundException(nameof(Contest), request.ContestId);
        }

        if (contest.AntiCheatLevel == AntiCheatLevel.None)
        {
            return new ViolationResultDto
            {
                ViolationCount = 0,
                MaxViolations = 0,
                IsDisqualified = false,
                Message = "Anti-cheat is not enabled for this contest."
            };
        }

        // Deduplicate rapid-fire violations of the same type within 3 seconds
        bool isDuplicate = await DbContext.AntiCheatViolations
            .AnyAsync(v => v.ContestId == request.ContestId
                           && v.StudentId == CurrentUserId
                           && v.ViolationType == request.ViolationType
                           && v.OccurredAt > DateTimeOffset.UtcNow.AddSeconds(-3), ct);

        if (isDuplicate)
        {
            return new ViolationResultDto
            {
                ViolationCount = registration.ViolationCount,
                MaxViolations = contest.MaxViolations,
                IsDisqualified = false,
                Message = "Duplicate violation ignored."
            };
        }

        // Record the violation
        AntiCheatViolation violation = new(
            Guid.NewGuid(),
            request.ContestId,
            CurrentUserId,
            request.ViolationType,
            request.Details,
            request.Timestamp != default ? request.Timestamp : DateTimeOffset.UtcNow
        );

        await DbContext.AntiCheatViolations.AddAsync(violation, ct);

        // Increment violation count
        registration.ViolationCount++;

        // Check auto-disqualification for Strict mode
        bool shouldDisqualify = contest.AntiCheatLevel == AntiCheatLevel.Strict
                                && registration.ViolationCount >= contest.MaxViolations;

        if (shouldDisqualify)
        {
            registration.IsDisqualified = true;
            registration.DisqualifiedAt = DateTimeOffset.UtcNow;
            registration.DisqualifiedReason = $"Auto: Exceeded violation threshold ({registration.ViolationCount}/{contest.MaxViolations})";
        }

        return new ViolationResultDto
        {
            ViolationCount = registration.ViolationCount,
            MaxViolations = contest.MaxViolations,
            IsDisqualified = shouldDisqualify,
            Message = shouldDisqualify
                ? "You have been disqualified due to excessive violations."
                : $"Warning {registration.ViolationCount}/{contest.MaxViolations}: {request.ViolationType} detected."
        };
    }
}