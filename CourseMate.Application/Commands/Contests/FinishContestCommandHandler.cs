using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Contests;

public class FinishContestCommand : IRequest<ResultIdDto>
{
    public Guid ContestId { get; set; }
}

internal sealed class FinishContestCommandHandler : AbstractCommandHandler<FinishContestCommand, ResultIdDto>
{
    public FinishContestCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(FinishContestCommand request, CancellationToken ct)
    {
        ContestRegistration? registration = await DbContext.ContestRegistrations
            .FirstOrDefaultAsync(x => x.ContestId == request.ContestId && x.StudentId == CurrentUserId, ct);

        if (registration == null)
        {
            throw new BusinessException(ErrorCode.Unknown, "You are not registered for this contest.");
        }

        if (registration.SubmitTime.HasValue)
        {
            return new ResultIdDto { Id = registration.Id };
        }

        registration.SubmitTime = DateTimeOffset.UtcNow;
        await DbContext.SaveChangesAsync(ct);

        return new ResultIdDto { Id = registration.Id };
    }
}