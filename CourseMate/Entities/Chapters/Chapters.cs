using System.ComponentModel.DataAnnotations;
using Pgvector;
using Volo.Abp.Domain.Entities.Auditing;

namespace CourseMate.Entities.Chapters;

public class Chapter : FullAuditedEntity<Guid>
{
    public Chapter(Guid id, string title, Guid courseId, int sortNumber) : base(id)
    {
        Title = title;
        CourseId = courseId;
        SortNumber = sortNumber;
    }

    [MaxLength(1024)]
    public string Title { get; set; }

    public Guid CourseId { get; set; }

    [Range(0, int.MaxValue)]
    public int SortNumber { get; set; }
}