namespace CourseMate.Contracts.DTOs.Commons;

public class TopInstructorDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int CourseCount { get; set; }
    public decimal TotalRevenue { get; set; }
}