using System.ComponentModel.DataAnnotations;
using Volo.Abp.Domain.Entities.Auditing;

namespace CourseMate.Entities.Chapters;

public class Chapter : FullAuditedEntity<Guid>
{
    public Chapter(Guid id, string title, Guid courseId, int position) : base(id)
    {
        Title = title;
        CourseId = courseId;
        Position = position;
    }

    [MaxLength(1024)]
    public string Title { get; set; }

    public Guid CourseId { get; set; }

    [Range(0, int.MaxValue)]
    public int Position { get; set; }
}