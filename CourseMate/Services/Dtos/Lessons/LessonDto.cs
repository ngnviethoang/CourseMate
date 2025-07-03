using Volo.Abp.Application.Dtos;

namespace CourseMate.Services.Dtos.Lessons;

public class LessonDto : AuditedEntityDto<Guid>
{
    public string Title { get; set; } = string.Empty;

    public string ContentText { get; set; } = string.Empty;

    public string VideoUrl { get; set; } = string.Empty;

    public TimeSpan Duration { get; set; }
    public Guid ChapterId { get; set; }
}