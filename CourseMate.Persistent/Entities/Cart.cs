using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class Cart : Entity
{
    public Cart(Guid id, Guid studentId) : base(id)
    {
        StudentId = studentId;
    }

    public Guid StudentId { get; set; }
}