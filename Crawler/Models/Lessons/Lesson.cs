namespace Crawler.Models.Lessons;

public class Lesson
{
    public Guid Id { get; set; }

    public string Title { get; set; }

    public string ContentText { get; set; }

    public string VideoFile { get; set; }

    public TimeSpan Duration { get; set; }

    public Guid ChapterId { get; set; }

    public int Position { get; set; }
}