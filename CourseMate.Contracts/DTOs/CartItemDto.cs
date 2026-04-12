namespace CourseMate.Contracts.DTOs;

public class CartItemDto
{
    public Guid Id { get; set; }

    public Guid CourseId { get; set; }

    public string CourseTitle { get; set; } = string.Empty;

    public string CourseImageUrl { get; set; } = string.Empty;

    public string InstructorName { get; set; } = string.Empty;

    public decimal Price { get; set; }
}