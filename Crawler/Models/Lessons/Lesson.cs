namespace Crawler.Models.Lessons;

public class Lesson
{
    public Guid Id { get; set; }

    public LessonType Type { get; set; }

    public Guid ChapterId { get; set; }

    public int Position { get; set; }

    public string Title { get; set; }

    public string Content { get; set; }

    // Video fields
    public string? VideoFile { get; set; }

    public TimeSpan? Duration { get; set; }

    // Coding fields (serialized)
    public string? CodeSampleJson { get; set; }

    // Quiz fields (serialized)
    public string? OptionsJson { get; set; }

    public string? CorrectAnswerJson { get; set; }

    public string? Explanation { get; set; }
}