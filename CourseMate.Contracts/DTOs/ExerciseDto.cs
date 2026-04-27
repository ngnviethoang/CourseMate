namespace CourseMate.Contracts.DTOs;

public class ExerciseDto
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
}