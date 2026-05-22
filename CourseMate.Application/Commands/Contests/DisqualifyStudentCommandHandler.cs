using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Contests;

public class DisqualifyStudentCommand : IRequest<ResultIdDto>
{
    public Guid ContestId { get; set; }
    public Guid StudentId { get; set; }
    public string Reason { get; set; } = string.Empty;
}

internal sealed class DisqualifyStudentCommandHandler : AbstractCommandHandler<DisqualifyStudentCommand, ResultIdDto>
{
    public DisqualifyStudentCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(DisqualifyStudentCommand request, CancellationToken ct)
    {
        Contest? contest = await DbContext.Contests.FindAsync([request.ContestId], ct);
        if (contest == null)
        {
            throw new EntityNotFoundException(nameof(Contest), request.ContestId);
        }

        // Only contest creator or admin can disqualify
        if (contest.CreatorId != CurrentUserId && !IsInRole(Roles.Admin))
        {
            throw new UnauthorizedAccessException("You are not authorized to disqualify students in this contest.");
        }

        ContestRegistration? registration = await DbContext.ContestRegistrations
            .FirstOrDefaultAsync(x => x.ContestId == request.ContestId && x.StudentId == request.StudentId, ct);

        if (registration == null)
        {
            throw new BusinessException(ErrorCode.Unknown, "Student is not registered for this contest.");
        }

        registration.IsDisqualified = true;
        registration.DisqualifiedAt = DateTimeOffset.UtcNow;
        registration.DisqualifiedReason = $"Manual: {request.Reason}";

        await DbContext.SaveChangesAsync(ct);

        return new ResultIdDto { Id = registration.Id };
    }
}