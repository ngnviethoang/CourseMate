using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs;

public class LessonDto
{
    public Guid Id { get; set; }

    public Guid ChapterId { get; set; }

    public string ChapterName { get; set; } = string.Empty;

    public Guid CourseId { get; set; }

    public string CourseName { get; set; } = string.Empty;

    public Guid InstructorId { get; set; }

    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    public string Position { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public DateTimeOffset CreationTime { get; set; }

    public DateTimeOffset? LastModificationTime { get; set; }
}