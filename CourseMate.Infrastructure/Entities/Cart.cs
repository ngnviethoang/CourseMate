using CourseMate.Infrastructure.Entities.Abstracts;

namespace CourseMate.Infrastructure.Entities;

public class Cart : Entity
{
    public Cart(Guid id, Guid studentId) : base(id)
    {
        StudentId = studentId;
    }

    public Guid StudentId { get; set; }
}