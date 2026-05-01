using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Contests;

internal sealed class CreateContestCommandHandler : AbstractCommandHandler<CreateContestCommand, ResultIdDto>
{
    public CreateContestCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateContestCommand request, CancellationToken ct)
    {
        Contest contest = new(
            Guid.NewGuid(),
            request.Title,
            request.Description,
            ContestStatus.Draft,
            request.StartTime,
            request.EndTime,
            request.DurationInMinutes,
            request.AllowedLanguages,
            request.MemoryLimit,
            request.TimeLimit,
            request.AntiCheatLevel,
            CurrentUserId
        );

        await DbContext.Contests.AddAsync(contest, ct);
        await DbContext.SaveChangesAsync(ct);

        return new ResultIdDto { Id = contest.Id };
    }
}
