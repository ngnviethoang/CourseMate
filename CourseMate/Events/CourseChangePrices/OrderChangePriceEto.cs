namespace CourseMate.Events.CourseChangePrices;

public class CourseChangePriceEto
{
    public Guid CourseId { get; set; }
    public decimal OldPrice { get; set; }
    public decimal NewPrice { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}