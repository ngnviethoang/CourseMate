using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using MediatR;

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
}