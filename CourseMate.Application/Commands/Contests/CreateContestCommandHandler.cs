using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Contests;

public class CreateContestCommand : IRequest<ResultIdDto>
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTimeOffset? StartTime { get; set; }
    public DateTimeOffset? EndTime { get; set; }
    public int DurationInMinutes { get; set; }
    public string AllowedLanguages { get; set; } = string.Empty;
    public int MemoryLimit { get; set; }
    public int TimeLimit { get; set; }
    public AntiCheatLevel AntiCheatLevel { get; set; }
    public int MaxViolations { get; set; } = 5;
}

public sealed class CreateContestCommandHandler : AbstractCommandHandler<CreateContestCommand, ResultIdDto>
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
            CurrentUserId,
            request.MaxViolations
        );

        await DbContext.Contests.AddAsync(contest, ct);

        return new ResultIdDto { Id = contest.Id };
    }
}