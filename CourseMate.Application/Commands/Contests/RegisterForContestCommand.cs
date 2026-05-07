using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Contests;

public class RegisterForContestCommand : IRequest<ResultIdDto>
{
    public Guid ContestId { get; set; }
}

internal sealed class RegisterForContestCommandHandler : AbstractCommandHandler<RegisterForContestCommand, ResultIdDto>
{
    public RegisterForContestCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(RegisterForContestCommand request, CancellationToken ct)
    {
        Contest? contest = await DbContext.Contests
            .FirstOrDefaultAsync(x => x.Id == request.ContestId, ct);

        if (contest == null)
        {
            throw new KeyNotFoundException("Contest not found.");
        }

        if (contest.Status == ContestStatus.Draft)
        {
            throw new InvalidOperationException("Contest is not open for registration.");
        }

        if (contest.EndTime.HasValue && contest.EndTime.Value < DateTimeOffset.UtcNow)
        {
            throw new InvalidOperationException("Contest has already ended.");
        }

        // Check if already registered
        bool alreadyRegistered = await DbContext.ContestRegistrations
            .AnyAsync(x => x.ContestId == request.ContestId && x.StudentId == CurrentUserId, ct);

        if (alreadyRegistered)
        {
            throw new InvalidOperationException("You are already registered for this contest.");
        }

        ContestRegistration registration = new(
            Guid.NewGuid(),
            request.ContestId,
            CurrentUserId,
            DateTimeOffset.UtcNow,
            false
        );

        await DbContext.ContestRegistrations.AddAsync(registration, ct);
        await DbContext.SaveChangesAsync(ct);

        return new ResultIdDto { Id = registration.Id };
    }
}