using System.ComponentModel.DataAnnotations;

namespace Crawler.Models.Chapters;

public class Chapter
{
    public Guid Id { get; set; }

    [MaxLength(1024)]
    public string Title { get; set; }

    public Guid CourseId { get; set; }

    [Range(0, int.MaxValue)]
    public int Position { get; set; }
}