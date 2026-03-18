using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs.Students;

public class LessonDetailDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    public int Position { get; set; }

    public bool IsCompleted { get; set; }
}