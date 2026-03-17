using CourseMate.Contract.Enums;

namespace CourseMate.Contract.DTOs.Admins;

public class LessonDto
{
    public Guid Id { get; set; }

    public Guid ChapterId { get; set; }

    public string ChapterName { get; set; } = string.Empty;

    public Guid CourseId { get; set; }

    public string CourseName { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    public int Position { get; set; }

    public DateTimeOffset CreationTime { get; set; }

    public DateTimeOffset? LastModificationTime { get; set; }
}