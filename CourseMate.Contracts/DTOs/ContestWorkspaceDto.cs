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
    public List<ContestExerciseDto> Exercises { get; set; } = [];
}

public class ContestExerciseDto
{
    public Guid Id { get; set; }
    public Guid ExerciseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int ScoreWeight { get; set; }
    public int Order { get; set; }
    public int? BestScore { get; set; }
    public bool IsPassed { get; set; }

    // Exercise details
    public List<ExerciseExampleDto> Examples { get; set; } = [];
    public List<string> Constraints { get; set; } = [];
    public List<string> Hints { get; set; } = [];
    public List<ExerciseDefaultCodeDto> DefaultCodes { get; set; } = [];
    public List<ExerciseTestCaseDto> TestCases { get; set; } = [];
}
