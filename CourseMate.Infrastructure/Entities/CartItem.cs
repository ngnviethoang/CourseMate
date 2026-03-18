using CourseMate.Infrastructure.Entities.Abstracts;

namespace CourseMate.Infrastructure.Entities;

public class CartItem : Entity
{
    public CartItem(Guid id, Guid cartId, Guid courseId) : base(id)
    {
        CartId = cartId;
        CourseId = courseId;
    }

    public Guid CartId { get; set; }

    public Guid CourseId { get; set; }
}