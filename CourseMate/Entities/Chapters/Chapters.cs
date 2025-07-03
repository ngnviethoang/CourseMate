using System.ComponentModel.DataAnnotations;
using Pgvector;
using Volo.Abp.Domain.Entities.Auditing;

namespace CourseMate.Entities.Chapters;

public class Chapter : FullAuditedEntity<Guid>
{
    public Chapter(Guid id, string title, Guid courseId) : base(id)
    {
        Title = title;
        CourseId = courseId;
    }

    [MaxLength(1024)]
    public string Title { get; set; }

    public Guid CourseId { get; set; }
}