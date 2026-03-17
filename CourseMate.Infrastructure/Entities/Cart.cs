using CourseMate.Core.Entities.Abstracts;

namespace CourseMate.Core.Entities;

public class Cart : Entity
{
    public Cart(Guid id, Guid studentId) : base(id)
    {
        StudentId = studentId;
    }

    public Guid StudentId { get; set; }
}