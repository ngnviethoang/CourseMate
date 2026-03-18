using MediatR;

namespace CourseMate.Contracts.DTOs.Students;

public class GetCourseByIdQuery : IRequest<CourseDetailDto?>
{
    public Guid Id { get; set; }
}