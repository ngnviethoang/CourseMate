namespace CourseMate.Contracts.DTOs;

public class OutlineDto
{
    public Guid LessonId { get; set; }
    public LectureOutline LectureOutline { get; set; } = new();
}