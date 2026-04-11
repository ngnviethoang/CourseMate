using MediatR;

namespace CourseMate.Contracts.DTOs;

public class RegenerateOutlineCommand : IRequest<ProcessingStatusDto>
{
    public Guid LessonId { get; set; }
}