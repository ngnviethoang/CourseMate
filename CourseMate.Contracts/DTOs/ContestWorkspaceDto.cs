using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs;

public class ContestWorkspaceDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public ContestStatus Status { get; set; }
    public DateTimeOffset? StartTime { get; set; }
    public DateTimeOffset? EndTime { get; set; }
    public int DurationInMinutes { get; set; }
    public DateTimeOffset? JoinTime { get; set; }
    public AntiCheatLevel AntiCheatLevel { get; set; }
    public int MaxViolations { get; set; }
    public int ViolationCount { get; set; }
    public bool IsDisqualified { get; set; }
    public List<ContestExerciseDto> Exercises { get; set; } = [];
}