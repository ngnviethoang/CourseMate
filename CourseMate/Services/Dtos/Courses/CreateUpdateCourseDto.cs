using System.ComponentModel.DataAnnotations;
using CourseMate.Entities.Courses;

namespace CourseMate.Services.Dtos.Courses;

public class CreateUpdateCourseDto
{
    [MaxLength(1024)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1024)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(1024)]
    public string ThumbnailUrl { get; set; } = string.Empty;

    public decimal Price { get; set; }
    public CurrencyType Currency { get; set; }
    public LevelType LevelType { get; set; }
    public bool IsPublished { get; set; }
    public Guid InstructorId { get; set; }
    public Guid CategoryId { get; set; }
}