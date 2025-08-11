using CourseMate.Entities.Courses;

namespace CourseMate.Services.Dtos.Courses;

public class CreateUpdateCourseDto
{
    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Summary { get; set; } = string.Empty;

    [MaxLength(CourseMateConst.FileNameMaxLength)]
    public string ThumbnailFile { get; set; } = string.Empty;

    public decimal Price { get; set; }
    public CurrencyType Currency { get; set; }
    public LevelType LevelType { get; set; }
    public bool IsActive { get; set; }
    public Guid CategoryId { get; set; }
}