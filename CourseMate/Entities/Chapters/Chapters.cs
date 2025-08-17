namespace CourseMate.Entities.Chapters;

public class Chapter : FullAuditedEntity<Guid>
{
    public Chapter(Guid id, string title, Guid courseId, int position, string description) : base(id)
    {
        Title = title;
        CourseId = courseId;
        Position = position;
        Description = description;
    }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Title { get; set; }

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Description { get; set; }

    public Guid CourseId { get; set; }

    [Range(0, int.MaxValue)]
    public int Position { get; set; }
}