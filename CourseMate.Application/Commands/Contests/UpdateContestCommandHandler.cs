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

public class UpdateContestCommand : IRequest<ResultIdDto>
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ContestStatus Status { get; set; }
    public DateTimeOffset? StartTime { get; set; }
    public DateTimeOffset? EndTime { get; set; }
    public int DurationInMinutes { get; set; }
    public string AllowedLanguages { get; set; } = string.Empty;
    public int MemoryLimit { get; set; }
    public int TimeLimit { get; set; }
    public AntiCheatLevel AntiCheatLevel { get; set; }
    public int MaxViolations { get; set; } = 5;
}

internal sealed class UpdateContestCommandHandler : AbstractCommandHandler<UpdateContestCommand, ResultIdDto>
{
    public UpdateContestCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(UpdateContestCommand request, CancellationToken ct)
    {
        Contest? contest = await DbContext.Contests.FirstOrDefaultAsync(x => x.Id == request.Id, ct);
        if (contest == null)
        {
            throw new EntityNotFoundException(nameof(Contest), request.Id);
        }

        // Check if current user is the creator (or admin - assuming admin check is done via controller roles but good to have here too)
        if (contest.CreatorId != CurrentUserId && !IsInRole(Roles.Admin))
        {
            throw new UnauthorizedAccessException("You are not authorized to update this contest.");
        }

        contest.Title = request.Title;
        contest.Description = request.Description;
        contest.Status = request.Status;
        contest.StartTime = request.StartTime;
        contest.EndTime = request.EndTime;
        contest.DurationInMinutes = request.DurationInMinutes;
        contest.AllowedLanguages = request.AllowedLanguages;
        contest.MemoryLimit = request.MemoryLimit;
        contest.TimeLimit = request.TimeLimit;
        contest.AntiCheatLevel = request.AntiCheatLevel;
        contest.MaxViolations = request.MaxViolations;

        await DbContext.SaveChangesAsync(ct);

        return new ResultIdDto { Id = contest.Id };
    }
}