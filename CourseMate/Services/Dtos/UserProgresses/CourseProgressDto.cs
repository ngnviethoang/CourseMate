using CourseMate.Entities.Lessons;

namespace CourseMate.Services.Dtos.UserProgresses;

public class CourseProgressDto
{
    public Guid CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Position { get; set; }
    public IEnumerable<ChapterProgressDto> Chapters { get; set; } = [];
}

public class ChapterProgressDto
{
    public Guid ChapterId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Position { get; set; }
    public Guid CourseId { get; set; }
    public IEnumerable<LessonProgressDto> Lessons { get; set; } = [];
}

public class LessonProgressDto
{
    public Guid LessonId { get; set; }
    public Guid UserProgressId { get; set; }
    public string Title { get; set; } = string.Empty;
    public LessonType Type { get; set; }
    public Guid ChapterId { get; set; }
    public int Position { get; set; }
    public TimeSpan Duration { get; set; }
    public bool IsCompleted { get; set; }
    public TimeSpan? WatchedDuration { get; set; }
}