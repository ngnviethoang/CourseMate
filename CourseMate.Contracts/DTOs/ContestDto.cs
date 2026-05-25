using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs;

public class ContestDto
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
    public int MaxViolations { get; set; }
    public Guid CreatorId { get; set; }
    public string? CreatorName { get; set; }
    public DateTimeOffset CreationTime { get; set; }
    public DateTimeOffset? LastModificationTime { get; set; }
    public int ExerciseCount { get; set; }
    public int ParticipantCount { get; set; }
    public bool IsRegistered { get; set; }
    public List<ContestExerciseDto> Exercises { get; set; } = new();
}