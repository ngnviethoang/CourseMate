using Volo.Abp.Application.Dtos;

namespace CourseMate.Services.Dtos.Chapters;

public class ChapterDto : AuditedEntityDto<Guid>
{
    public string Title { get; set; } = string.Empty;
    public Guid CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public int SortNumber { get; set; }
}