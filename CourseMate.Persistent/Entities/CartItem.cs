using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

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