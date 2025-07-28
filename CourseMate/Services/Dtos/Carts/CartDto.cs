using CourseMate.Services.Dtos.Courses;

namespace CourseMate.Services.Dtos.Carts;

public class CartDto : AuditedEntityDto<Guid>
{
    public Guid CourseId { get; set; }
    public Guid StudentId { get; set; }
    public CourseDto? Course { get; set; }
}