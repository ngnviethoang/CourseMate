namespace CourseMate.Services.Dtos.Orders;

public class CreateUpdateOrderItemDto
{
    public Guid OrderId { get; set; }
    public Guid CourseId { get; set; }
    public decimal Price { get; set; }
}