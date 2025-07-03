using System.ComponentModel.DataAnnotations;
using Pgvector;
using Volo.Abp.Domain.Entities.Auditing;

namespace CourseMate.Entities.Lessons;

public class Lesson : FullAuditedEntity<Guid>
{
    public Lesson(Guid id, string title, string contentText, string videoUrl, TimeSpan duration, Guid chapterId) : base(id)
    {
        Title = title;
        ContentText = contentText;
        VideoUrl = videoUrl;
        Duration = duration;
        ChapterId = chapterId;
    }

    [MaxLength(1024)]
    public string Title { get; set; }

    [MaxLength(1024)]
    public string ContentText { get; set; }

    [MaxLength(1024)]
    public string VideoUrl { get; set; }

    public TimeSpan Duration { get; set; }
    public Guid ChapterId { get; set; }

    public Vector? Embedding { get; set; }
}