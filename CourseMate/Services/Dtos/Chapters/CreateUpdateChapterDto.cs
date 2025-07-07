using System.ComponentModel.DataAnnotations;

namespace CourseMate.Services.Dtos.Chapters;

public class CreateUpdateChapterDto
{
    [MaxLength(1024)]
    public string Title { get; set; } = string.Empty;

    public Guid CourseId { get; set; }

    [Range(0, int.MaxValue)]
    public int SortNumber { get; set; }
}