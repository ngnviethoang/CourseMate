using CourseMate.Services.Dtos.Courses;

namespace CourseMate.Services.Dtos.Orders;

public class OrderItemDto : EntityDto<Guid>
{
    public Guid OrderId { get; set; }
    public Guid CourseId { get; set; }
    public decimal Price { get; set; }

    // Extra Properties
    public CourseDto? Course { get; set; }
}