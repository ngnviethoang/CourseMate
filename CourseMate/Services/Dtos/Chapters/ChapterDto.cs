using CourseMate.Services.Dtos.Lessons;

namespace CourseMate.Services.Dtos.Chapters;

public class ChapterDto : AuditedEntityDto<Guid>
{
    public string Title { get; set; } = string.Empty;
    public Guid CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public int Position { get; set; }

    // ExtraProperties 
    public IEnumerable<LessonDto>? Lessons { get; set; }
}