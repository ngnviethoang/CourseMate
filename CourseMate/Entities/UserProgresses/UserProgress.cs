namespace CourseMate.Entities.UserProgresses;

public class UserProgress : FullAuditedEntity<Guid>
{
    public UserProgress(Guid id, Guid userId, Guid lessonId, bool isCompleted, TimeSpan? watchedDuration) : base(id)
    {
        UserId = userId;
        LessonId = lessonId;
        IsCompleted = isCompleted;
        WatchedDuration = watchedDuration;
    }

    public Guid UserId { get; set; }
    public Guid LessonId { get; set; }
    public bool IsCompleted { get; set; }
    public TimeSpan? WatchedDuration { get; set; } // For lesson video
}