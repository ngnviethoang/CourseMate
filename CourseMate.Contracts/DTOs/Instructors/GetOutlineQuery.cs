using MediatR;

namespace CourseMate.Contracts.DTOs.Instructors;

public class GetOutlineQuery : IRequest<OutlineDto?>
{
    public Guid LessonId { get; set; }
}