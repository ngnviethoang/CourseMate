namespace CourseMate.Services.Dtos.UserProgresses;

public class CreateUpdateUserProgressDto
{
    public Guid? UserProgressId { get; set; }
    public Guid LessonId { get; set; }
    public bool IsCompleted { get; set; }
    public TimeSpan? WatchedDuration { get; set; } // For lesson video
}