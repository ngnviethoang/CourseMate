using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Contests;

public class CheckInContestCommand : IRequest<ResultIdDto>
{
    public Guid ContestId { get; set; }
}

public sealed class CheckInContestCommandHandler : AbstractCommandHandler<CheckInContestCommand, ResultIdDto>
{
    public CheckInContestCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CheckInContestCommand request, CancellationToken ct)
    {
        ContestRegistration? registration = await DbContext.ContestRegistrations
            .FirstOrDefaultAsync(x => x.ContestId == request.ContestId && x.StudentId == CurrentUserId, ct);

        if (registration == null)
        {
            throw new BusinessException(ErrorCode.Unknown, "You are not registered for this contest.");
        }

        if (registration.JoinTime.HasValue)
        {
            return new ResultIdDto { Id = registration.Id };
        }

        Contest? contest = await DbContext.Contests.FindAsync([request.ContestId], ct);
        if (contest == null || contest.Status == ContestStatus.Draft || contest.Status == ContestStatus.Upcoming)
        {
            // Maybe allow check-in 5-10 mins before? The plan said "Before giờ thi 5-10 phút, sinh viên vào phòng chờ."
            // For now let's just check if StartTime is near.
            if (contest?.StartTime.HasValue == true && contest.StartTime.Value > DateTimeOffset.UtcNow.AddMinutes(10))
            {
                throw new BusinessException(ErrorCode.Unknown, "Contest hasn't started yet.");
            }
        }

        registration.JoinTime = DateTimeOffset.UtcNow;

        return new ResultIdDto { Id = registration.Id };
    }
}