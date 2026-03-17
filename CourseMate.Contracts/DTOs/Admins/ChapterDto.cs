namespace CourseMate.Contract.DTOs.Admins;

public class ChapterDto
{
    public Guid Id { get; set; }

    public Guid CourseId { get; set; }

    public string CourseName { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public int Position { get; set; }
}