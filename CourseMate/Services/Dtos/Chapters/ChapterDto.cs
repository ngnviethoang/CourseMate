using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace CourseMate.Services.Dtos.Chapters;

public class ChapterDto : AuditedEntityDto<Guid>
{
    [MaxLength(1024)]
    public string Title { get; set; } = string.Empty;

    public Guid CourseId { get; set; }
}