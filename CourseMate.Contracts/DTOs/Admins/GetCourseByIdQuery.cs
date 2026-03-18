using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class GetCourseByIdQuery : IRequest<CourseDto?>
{
    public GetCourseByIdQuery(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}