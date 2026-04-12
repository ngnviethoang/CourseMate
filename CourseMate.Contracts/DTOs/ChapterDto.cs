namespace CourseMate.Contracts.DTOs;

public class ChapterDto
{
    public Guid Id { get; set; }

    public Guid CourseId { get; set; }

    public Guid InstructorId { get; set; }

    public string CourseName { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public int Position { get; set; }

    public DateTimeOffset CreationTime { get; set; }

    public DateTimeOffset? LastModificationTime { get; set; }
}