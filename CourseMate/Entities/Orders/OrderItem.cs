using Volo.Abp.Domain.Entities;

namespace CourseMate.Entities.Orders;

public class OrderItem : Entity<Guid>
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