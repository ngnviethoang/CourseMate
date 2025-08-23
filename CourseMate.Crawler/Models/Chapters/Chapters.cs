namespace CourseMate.Crawler.Models.Chapters;

public class Chapter
{
    public Guid Id { get; set; }

    public string Title { get; set; }

    public Guid CourseId { get; set; }

    public int Position { get; set; }
}