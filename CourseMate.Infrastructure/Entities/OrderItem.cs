using CourseMate.Infrastructure.Entities.Abstracts;

namespace CourseMate.Infrastructure.Entities;

public class OrderItem : Entity
{
    public OrderItem(Guid id, Guid orderId, Guid courseId, decimal price) : base(id)
    {
        OrderId = orderId;
        CourseId = courseId;
        Price = price;
    }

    public Guid OrderId { get; set; }

    public Guid CourseId { get; set; }

    public decimal Price { get; set; }
}