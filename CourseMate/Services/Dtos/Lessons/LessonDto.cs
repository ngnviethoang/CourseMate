using CourseMate.Entities.Lessons;

namespace CourseMate.Services.Dtos.Lessons;

public class LessonDto : AuditedEntityDto<Guid>
{
    public LessonType Type { get; set; }

    public Guid ChapterId { get; set; }

    public int Position { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    // Video fields
    public string? VideoFile { get; set; }

    public TimeSpan Duration { get; set; }

    // Coding fields (serialized)
    public string? CodeSampleJson { get; set; }

    // Quiz fields (serialized)
    public string? OptionsJson { get; set; }

    public string? CorrectAnswerJson { get; set; }

    public string? Explanation { get; set; }

    public Guid CourseId { get; set; }
}