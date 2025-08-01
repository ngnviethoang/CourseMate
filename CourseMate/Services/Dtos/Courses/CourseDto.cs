using CourseMate.Entities.Courses;
using CourseMate.Services.Dtos.Categories;
using CourseMate.Services.Dtos.Chapters;

namespace CourseMate.Services.Dtos.Courses;

public class CourseDto : AuditedEntityDto<Guid>
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ThumbnailFile { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public CurrencyType Currency { get; set; }
    public LevelType LevelType { get; set; }
    public bool IsPublished { get; set; }
    public Guid InstructorId { get; set; }
    public Guid CategoryId { get; set; }
    public string Slug { get; set; } = string.Empty;

    // ExtraProperties 
    public AuthorDto? Author { get; set; }
    public int? TotalLessons { get; set; }
    public int? TotalStudents { get; set; }
    public IEnumerable<ChapterDto>? Chapters { get; set; }
    public bool IsInCart { get; set; }
    public bool IsEnrollment { get; set; }
    public CategoryDto? Category { get; set; }
}