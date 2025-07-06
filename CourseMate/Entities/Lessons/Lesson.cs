using System.ComponentModel.DataAnnotations;
using CourseMate.Shared.Constants;
using Pgvector;
using Volo.Abp.Domain.Entities.Auditing;

namespace CourseMate.Entities.Lessons;

public class Lesson : FullAuditedEntity<Guid>
{
    public Lesson(Guid id, string title, string contentText, string videoFile, TimeSpan duration, Guid chapterId) : base(id)
    {
        Title = title;
        ContentText = contentText;
        VideoFile = videoFile;
        Duration = duration;
        ChapterId = chapterId;
    }

    [MaxLength(1024)]
    public string Title { get; set; }

    [MaxLength(2048)]
    public string ContentText { get; set; }

    [MaxLength(CourseMateConst.FileNameMaxLength)]
    public string VideoFile { get; set; }

    public TimeSpan Duration { get; set; }
    public Guid ChapterId { get; set; }
}