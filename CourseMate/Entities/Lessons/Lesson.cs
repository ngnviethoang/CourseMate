namespace CourseMate.Entities.Lessons;

public class Lesson : FullAuditedEntity<Guid>
{
    public Lesson(Guid id, LessonType lessonType, Guid chapterId, int position, string title) : base(id)
    {
        LessonType = lessonType;
        ChapterId = chapterId;
        Position = position;
        Title = title;
    }

    public LessonType LessonType { get; set; }

    public Guid ChapterId { get; set; }

    public int Position { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Title { get; set; }
}