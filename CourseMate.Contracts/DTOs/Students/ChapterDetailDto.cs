namespace CourseMate.Contracts.DTOs.Students;

public class ChapterDetailDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public int Position { get; set; }

    public List<LessonDetailDto> Lessons { get; set; } = [];
}