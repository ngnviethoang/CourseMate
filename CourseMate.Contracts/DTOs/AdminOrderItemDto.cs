namespace CourseMate.Contracts.DTOs;

public class AdminOrderItemDto
{
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }

    public Guid CourseId { get; set; }

    public string CourseTitle { get; set; } = string.Empty;

    public decimal Price { get; set; }
}