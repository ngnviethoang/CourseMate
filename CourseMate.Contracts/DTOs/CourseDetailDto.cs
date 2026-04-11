namespace CourseMate.Contracts.DTOs;

public class CourseDetailDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public Guid CategoryId { get; set; }

    public string CategoryName { get; set; } = string.Empty;

    public Guid InstructorId { get; set; }

    public string InstructorName { get; set; } = string.Empty;

    public bool IsEnrolled { get; set; }

    public double ProgressPercentage { get; set; }

    public List<ChapterDetailDto> Chapters { get; set; } = [];
}