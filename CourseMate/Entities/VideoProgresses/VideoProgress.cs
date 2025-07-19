namespace CourseMate.Entities.VideoProgresses;

public class VideoProgress : FullAuditedEntityDto<Guid>
{
    public Guid UserId { get; set; }
    public Guid LessonId { get; set; }
    public TimeSpan WatchedSeconds { get; set; }
    public TimeSpan MaxAllowedSeek { get; set; }
    public bool IsCompleted { get; set; }
}