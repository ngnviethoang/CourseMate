namespace CourseMate.Contracts.DTOs.Students;

public class OrderItemDto
{
    public Guid Id { get; set; }

    public Guid CourseId { get; set; }

    public string CourseTitle { get; set; } = string.Empty;

    public string CourseImageUrl { get; set; } = string.Empty;

    public decimal Price { get; set; }
}