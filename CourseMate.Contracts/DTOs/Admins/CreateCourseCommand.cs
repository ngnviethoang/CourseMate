using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class CreateCourseCommand : IRequest<ResultIdDto>
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public bool IsPublished { get; set; }

    public Guid CategoryId { get; set; }

    public Guid InstructorId { get; set; }
}