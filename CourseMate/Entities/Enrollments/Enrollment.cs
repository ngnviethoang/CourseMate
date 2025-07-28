namespace CourseMate.Entities.Enrollments;

public class Enrollment : FullAuditedEntity<Guid>
{
    public Enrollment(Guid id, Guid studentId, Guid courseId) : base(id)
    {
        StudentId = studentId;
        CourseId = courseId;
    }

    public Guid StudentId { get; set; }
    public Guid CourseId { get; set; }
}