namespace CourseMate.Entities.Courses;

public class Course : FullAuditedEntity<Guid>
{
    public Course(Guid id, string title, string description, string thumbnailFile, decimal price, CurrencyType currency, LevelType levelType, bool isPublished, string summary, Guid instructorId, Guid categoryId) : base(id)
    {
        Title = title;
        Description = description;
        ThumbnailFile = thumbnailFile;
        Price = price;
        Currency = currency;
        LevelType = levelType;
        IsPublished = isPublished;
        InstructorId = instructorId;
        CategoryId = categoryId;
        Summary = summary;
    }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Title { get; set; }

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Description { get; set; }

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Summary { get; set; }

    [MaxLength(CourseMateConst.FileNameMaxLength)]
    public string ThumbnailFile { get; set; }

    public decimal Price { get; set; }
    public CurrencyType Currency { get; set; }
    public LevelType LevelType { get; set; }
    public bool IsPublished { get; set; }
    public Guid InstructorId { get; set; }
    public Guid CategoryId { get; set; }
}