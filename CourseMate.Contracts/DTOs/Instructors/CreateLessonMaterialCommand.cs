using MediatR;

namespace CourseMate.Contracts.DTOs.Instructors;

public class CreateLessonMaterialCommand : IRequest<ProcessingStatusDto>
{
    public Guid LessonId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public byte[] Content { get; set; } = [];
}