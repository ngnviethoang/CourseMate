namespace CourseMate.Services.Dtos.Lessons;

public class CreateUpdateLessonDto
{
    [MaxLength(1024)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(10000)]
    public string Content { get; set; } = string.Empty;

    [MaxLength(CourseMateConst.FileNameMaxLength)]
    public string VideoFile { get; set; } = string.Empty;

    public TimeSpan Duration { get; set; }
    public Guid ChapterId { get; set; }

    [Range(0, int.MaxValue)]
    public int Position { get; set; }
}