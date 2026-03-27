using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs.Instructors;

public class ProcessingStatusDto
{
    public Guid LessonMaterialId { get; set; }
    public Guid LessonId { get; set; }
    public DocumentProcessingStatus Status { get; set; }
}