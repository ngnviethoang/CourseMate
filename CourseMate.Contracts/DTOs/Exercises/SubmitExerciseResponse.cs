namespace CourseMate.Contracts.DTOs.Exercises;

public class SubmitExerciseResponse
{
    public Guid SubmissionId { get; set; }
    public List<TestResultDto> TestResults { get; set; } = new();
}

public class TestResultDto
{
    public bool Passed { get; set; }
    public bool IsHidden { get; set; }
    public string ExpectedOutput { get; set; } = string.Empty;
    public string ActualOutput { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}