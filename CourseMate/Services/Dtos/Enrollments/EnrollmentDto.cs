using Volo.Abp.Application.Dtos;

namespace CourseMate.Services.Dtos.Enrollments;

public class EnrollmentDto : AuditedEntityDto<Guid>
{
    public Guid StudentId { get; set; }
    public Guid CourseId { get; set; }
    public bool IsCompleted { get; set; }
}