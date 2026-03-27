using MediatR;

namespace CourseMate.Contracts.DTOs.Instructors;

public class GetProcessingStatusQuery : IRequest<ProcessingStatusDto>
{
    public Guid LessonId { get; set; }
}