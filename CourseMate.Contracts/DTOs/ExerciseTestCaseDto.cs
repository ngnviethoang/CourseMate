namespace CourseMate.Contracts.DTOs;

public class ExerciseTestCaseDto
{
    public Guid Id { get; set; }
    public Guid ExerciseId { get; set; }
    public string Input { get; set; } = string.Empty;
    public string ExpectedOutput { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsHidden { get; set; }
    public int Order { get; set; }
}