using CourseMate.Infrastructure.Entities.Abstracts;

namespace CourseMate.Infrastructure.Entities;

public class Enrollment : Entity
{
    public Enrollment(Guid id, Guid studentId, Guid courseId) : base(id)
    {
        StudentId = studentId;
        CourseId = courseId;
    }

    public Guid StudentId { get; set; }

    public Guid CourseId { get; set; }
}