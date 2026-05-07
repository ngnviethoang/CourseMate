namespace CourseMate.Contracts.DTOs;

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
    public List<ExerciseExampleDto> Examples { get; set; } = [];
    public List<string> Constraints { get; set; } = [];
    public List<string> Hints { get; set; } = [];
    public List<ExerciseDefaultCodeDto> DefaultCodes { get; set; } = [];
    public List<ExerciseTestCaseDto> TestCases { get; set; } = [];
}