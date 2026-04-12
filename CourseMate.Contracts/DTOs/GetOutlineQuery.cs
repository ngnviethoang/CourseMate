using MediatR;

namespace CourseMate.Contracts.DTOs;

public class GetOutlineQuery : IRequest<OutlineDto?>
{
    public Guid LessonId { get; set; }
}