using MediatR;

namespace CourseMate.Contracts.DTOs;

public class GetProcessingStatusQuery : IRequest<ProcessingStatusDto>
{
    public Guid LessonId { get; set; }
}