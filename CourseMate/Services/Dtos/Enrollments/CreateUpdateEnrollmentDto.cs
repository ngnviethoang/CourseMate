namespace CourseMate.Services.Dtos.Enrollments;

public class CreateUpdateEnrollmentDto
{
    public Guid StudentId { get; set; }
    public Guid CourseId { get; set; }
    public bool IsCompleted { get; set; }
}