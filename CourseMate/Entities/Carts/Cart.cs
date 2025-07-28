namespace CourseMate.Entities.Carts;

public class Cart : FullAuditedEntity<Guid>
{
    public Cart(Guid id, Guid userId, Guid courseId) : base(id)
    {
        UserId = userId;
        CourseId = courseId;
    }

    public Guid UserId { get; set; }
    public Guid CourseId { get; set; }
}