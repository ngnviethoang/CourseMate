using MediatR;

namespace CourseMate.Contracts.DTOs;

public class GenerateSlideCommand : IRequest<ProcessingStatusDto>
{
    public Guid LessonId { get; set; }
}