namespace CourseMate.Contracts.DTOs;

public class ProcessingStatusDto
{
    public Guid LessonMaterialId { get; set; }
    public Guid LessonId { get; set; }
    public ProcessingStatus Status { get; set; }
}

public enum ProcessingStatus
{
    Processing,
    Done
}