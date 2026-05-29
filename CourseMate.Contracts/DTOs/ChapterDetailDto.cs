namespace CourseMate.Contracts.DTOs;

public class ChapterDetailDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Position { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public List<LessonDetailDto> Lessons { get; set; } = [];
}