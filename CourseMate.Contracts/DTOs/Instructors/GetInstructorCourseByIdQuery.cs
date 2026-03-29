using CourseMate.Contracts.DTOs.Admins;
using MediatR;

namespace CourseMate.Contracts.DTOs.Instructors;

public class GetInstructorCourseByIdQuery : IRequest<CourseDto?>
{
    public Guid Id { get; set; }
}