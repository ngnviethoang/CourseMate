using MediatR;

namespace CourseMate.Contracts.DTOs.Instructors;

public class RegenerateOutlineCommand : IRequest<ProcessingStatusDto>
{
    public Guid LessonId { get; set; }
}