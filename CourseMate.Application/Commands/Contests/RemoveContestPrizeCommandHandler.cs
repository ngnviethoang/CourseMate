using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Contests;

public class RemoveContestPrizeCommand : IRequest<Unit>
{
    public Guid ContestId { get; set; }
    public Guid PrizeId { get; set; }
}

public sealed class RemoveContestPrizeCommandHandler : AbstractCommandHandler<RemoveContestPrizeCommand, Unit>
{
    public RemoveContestPrizeCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(RemoveContestPrizeCommand request, CancellationToken ct)
    {
        ContestPrize? prize = await DbContext.ContestPrizes
            .FirstOrDefaultAsync(x => x.Id == request.PrizeId && x.ContestId == request.ContestId, ct);

        if (prize == null)
        {
            throw new BusinessException(ErrorCode.Unknown, "Prize not found.");
        }

        Contest? contest = await DbContext.Contests.FindAsync([request.ContestId], ct);
        bool isAdmin = IsInRole(Roles.Admin);
        if (!isAdmin && contest?.CreatorId != CurrentUserId)
        {
            throw new UnauthorizedAccessException("You are not allowed to manage prizes for this contest.");
        }

        DbContext.ContestPrizes.Remove(prize);
        await DbContext.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
