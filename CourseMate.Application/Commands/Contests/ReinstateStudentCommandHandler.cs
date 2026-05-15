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

public class ReinstateStudentCommand : IRequest<ResultIdDto>
{
    public Guid ContestId { get; set; }
    public Guid StudentId { get; set; }
}

internal sealed class ReinstateStudentCommandHandler : AbstractCommandHandler<ReinstateStudentCommand, ResultIdDto>
{
    public ReinstateStudentCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(ReinstateStudentCommand request, CancellationToken ct)
    {
        Contest? contest = await DbContext.Contests.FindAsync([request.ContestId], ct);
        if (contest == null)
        {
            throw new EntityNotFoundException(nameof(Contest), request.ContestId);
        }

        // Only contest creator or admin can reinstate
        if (contest.CreatorId != CurrentUserId && !IsInRole(Roles.Admin))
        {
            throw new UnauthorizedAccessException("You are not authorized to reinstate students in this contest.");
        }

        ContestRegistration? registration = await DbContext.ContestRegistrations
            .FirstOrDefaultAsync(x => x.ContestId == request.ContestId && x.StudentId == request.StudentId, ct);

        if (registration == null)
        {
            throw new BusinessException("Student is not registered for this contest.");
        }

        if (!registration.IsDisqualified)
        {
            throw new BusinessException("Student is not currently disqualified.");
        }

        registration.IsDisqualified = false;
        registration.DisqualifiedAt = null;
        registration.DisqualifiedReason = string.Empty;

        await DbContext.SaveChangesAsync(ct);

        return new ResultIdDto { Id = registration.Id };
    }
}