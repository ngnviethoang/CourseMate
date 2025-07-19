using System.ComponentModel.DataAnnotations;
using CourseMate.Shared.Constants;
using Volo.Abp.Domain.Entities.Auditing;

namespace CourseMate.Entities.Courses;

public class Course : FullAuditedEntity<Guid>
{
    public Course(Guid id, string title, string description, string thumbnailFile, decimal price, CurrencyType currency, LevelType levelType, bool isPublished, Guid instructorId, Guid categoryId) : base(id)
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
    }

    [MaxLength(1024)]
    public string Title { get; set; }

    [MaxLength(32768)] // 2^15
    public string Description { get; set; }

    [MaxLength(CourseMateConst.FileNameMaxLength)]
    public string ThumbnailFile { get; set; }

    public decimal Price { get; set; }
    public CurrencyType Currency { get; set; }
    public LevelType LevelType { get; set; }
    public bool IsPublished { get; set; }
    public Guid InstructorId { get; set; }
    public Guid CategoryId { get; set; }
}