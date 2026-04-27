namespace CourseMate.Contracts.DTOs;

public class GetExerciseByIdResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public Guid CreatedById { get; set; }
    public string? CreatedByName { get; set; }
    public int TestCaseCount { get; set; }
    public DateTimeOffset CreationTime { get; set; }
    public DateTimeOffset? LastModificationTime { get; set; }
    public IEnumerable<ExerciseExampleDto> Examples { get; set; } = [];
    public IEnumerable<string> Constraints { get; set; } = [];
    public IEnumerable<string> Hints { get; set; } = [];
    public IEnumerable<ExerciseTestCaseDto> TestCases { get; set; } = [];
    public IEnumerable<ExerciseDefaultCodeDto> DefaultCodes { get; set; } = [];
}