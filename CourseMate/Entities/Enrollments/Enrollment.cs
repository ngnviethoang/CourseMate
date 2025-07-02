using Volo.Abp.Domain.Entities.Auditing;

namespace CourseMate.Entities.Enrollments;

public class Enrollment : FullAuditedEntity<Guid>
{
    public Enrollment(Guid id, Guid studentId, Guid courseId, bool isCompleted) : base(id)
    {
        StudentId = studentId;
        CourseId = courseId;
        IsCompleted = isCompleted;
    }

    public Guid StudentId { get; set; }
    public Guid CourseId { get; set; }
    public bool IsCompleted { get; set; }
}