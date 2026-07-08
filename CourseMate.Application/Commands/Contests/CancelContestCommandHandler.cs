using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Contests;

public class CancelContestCommand : IRequest<ResultIdDto>
{
    public Guid ContestId { get; set; }
}

public sealed class CancelContestCommandHandler : AbstractCommandHandler<CancelContestCommand, ResultIdDto>
{
    public CancelContestCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CancelContestCommand request, CancellationToken ct)
    {
        Contest? contest = await DbContext.Contests.FindAsync([request.ContestId], ct);
        if (contest == null)
        {
            throw new BusinessException(ErrorCode.Unknown, "Contest not found.");
        }

        bool isAdmin = IsInRole(Roles.Admin);
        if (!isAdmin && contest.CreatorId != CurrentUserId)
        {
            throw new UnauthorizedAccessException("You are not allowed to cancel this contest.");
        }

        if (contest.Status == ContestStatus.Cancelled)
        {
            return new ResultIdDto { Id = contest.Id };
        }

        // Cancelled contests do NOT award any prizes.
        contest.Status = ContestStatus.Cancelled;

        await DbContext.SaveChangesAsync(ct);

        return new ResultIdDto { Id = contest.Id };
    }
}