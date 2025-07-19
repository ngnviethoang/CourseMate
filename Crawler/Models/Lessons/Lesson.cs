using System.ComponentModel.DataAnnotations;

namespace Crawler.Models.Lessons;

public class Lesson
{
    public Guid Id { get; set; }

    [MaxLength(1024)]
    public string Title { get; set; }

    [MaxLength(2048)]
    public string ContentText { get; set; }

    public string VideoFile { get; set; }

    public TimeSpan Duration { get; set; }

    public Guid ChapterId { get; set; }

    [Range(0, int.MaxValue)]
    public int Position { get; set; }
}