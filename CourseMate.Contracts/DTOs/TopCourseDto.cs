namespace CourseMate.Contracts.DTOs;

public class TopCourseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int EnrollmentCount { get; set; }
    public decimal Revenue { get; set; }
}