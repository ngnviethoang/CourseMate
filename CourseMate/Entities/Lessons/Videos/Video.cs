namespace CourseMate.Entities.Lessons.Videos;

public class Video : FullAuditedEntity<Guid>
{
    public Video(Guid id, string videoFile, TimeSpan duration, Guid lessonId) : base(id)
    {
        VideoFile = videoFile;
        Duration = duration;
        LessonId = lessonId;
    }

    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConst.FileNameMaxLength)]
    public string VideoFile { get; set; }

    public TimeSpan Duration { get; set; }
}