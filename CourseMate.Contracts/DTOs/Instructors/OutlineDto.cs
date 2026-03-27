namespace CourseMate.Contracts.DTOs.Instructors;

public class OutlineDto
{
    public Guid LessonId { get; set; }
    public Guid MaterialId { get; set; }
    public string LessonTitle { get; set; } = string.Empty;
    public List<OutlineSectionDto> Sections { get; set; } = [];
}