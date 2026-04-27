namespace CourseMate.Contracts.DTOs;

public class ExerciseDefaultCodeDto
{
    public Guid Id { get; set; }
    public Guid ExerciseId { get; set; }
    public string Language { get; set; } = string.Empty;
    public string StarterCode { get; set; } = string.Empty;
}