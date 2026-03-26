namespace CourseMate.Contracts.DTOs.Admins;

public class AdminOrderItemDto
{
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }

    public Guid CourseId { get; set; }

    public string? CourseTitle { get; set; }

    public decimal Price { get; set; }
}
