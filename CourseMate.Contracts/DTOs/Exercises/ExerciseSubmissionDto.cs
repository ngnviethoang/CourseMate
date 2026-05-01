namespace CourseMate.Contracts.DTOs.Exercises;

public class ExerciseSubmissionDto
{
    public Guid Id { get; set; }
    public string Language { get; set; }
    public string Code { get; set; }
    public bool Passed { get; set; }
    public double Score { get; set; }
    public double TotalTime { get; set; }
    public double TotalMemory { get; set; }
    public DateTimeOffset CreationTime { get; set; }
}
