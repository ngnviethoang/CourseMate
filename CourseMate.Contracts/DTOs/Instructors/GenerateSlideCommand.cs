using MediatR;

namespace CourseMate.Contracts.DTOs.Instructors;

public class GenerateSlideCommand : IRequest<ProcessingStatusDto>
{
    public Guid LessonId { get; set; }
}