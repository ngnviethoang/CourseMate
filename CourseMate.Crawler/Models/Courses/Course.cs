namespace CourseMate.Crawler.Models.Courses;

public class Course
{
    public Guid Id { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public string Summary { get; set; }

    public string ThumbnailFile { get; set; }

    public decimal Price { get; set; }
    public CurrencyType Currency { get; set; }
    public LevelType LevelType { get; set; }
    public bool IsPublished { get; set; }
    public Guid InstructorId { get; set; }
    public Guid CategoryId { get; set; }
}