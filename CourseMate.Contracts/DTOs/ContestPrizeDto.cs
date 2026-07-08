namespace CourseMate.Contracts.DTOs;

public class ContestPrizeDto
{
    public Guid Id { get; set; }
    public int MinRank { get; set; }
    public int MaxRank { get; set; }
    public Guid CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public string CourseImageUrl { get; set; } = string.Empty;
    public decimal CoursePrice { get; set; }
    public string CourseInstructorName { get; set; } = string.Empty;
}