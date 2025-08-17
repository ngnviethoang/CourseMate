namespace CourseMate.Services.Dtos.Lessons;

public class VideoDto : EntityDto<Guid>
{
    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConst.FileNameMaxLength)]
    public string VideoFile { get; set; } = string.Empty;

    public TimeSpan Duration { get; set; }
}