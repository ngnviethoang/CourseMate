namespace CourseMate.Contracts.DTOs;

public class ExerciseExampleDto
{
    public Guid Id { get; set; }
    public string Input { get; set; } = string.Empty;
    public string Output { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public Guid ExerciseId { get; set; }
}