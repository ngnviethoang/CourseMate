namespace CourseMate.Entities.Lessons;

public class Lesson : FullAuditedEntity<Guid>
{
    public Lesson(Guid id, string title, string contentText, string videoFile, TimeSpan duration, Guid chapterId, int position) : base(id)
    {
        Title = title;
        ContentText = contentText;
        VideoFile = videoFile;
        Duration = duration;
        ChapterId = chapterId;
        Position = position;
    }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Title { get; set; }

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string ContentText { get; set; }

    [MaxLength(CourseMateConst.FileNameMaxLength)]
    public string VideoFile { get; set; }

    public TimeSpan Duration { get; set; }

    public Guid ChapterId { get; set; }

    [Range(0, int.MaxValue)]
    public int Position { get; set; }
}