using System.ComponentModel.DataAnnotations;

namespace CourseMate.Services.Dtos.Lessons;

public class CreateUpdateLessonDto
{
    public Guid Id { get; set; }

    [MaxLength(1024)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1024)]
    public string ContentText { get; set; } = string.Empty;

    [MaxLength(1024)]
    public string VideoUrl { get; set; } = string.Empty;

    public TimeSpan Duration { get; set; }
    public Guid ChapterId { get; set; }
}