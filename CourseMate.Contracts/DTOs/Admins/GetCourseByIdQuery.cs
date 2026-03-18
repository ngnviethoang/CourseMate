using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class GetCourseByIdQuery : IRequest<CourseDto?>
{
    public Guid Id { get; set; }
}