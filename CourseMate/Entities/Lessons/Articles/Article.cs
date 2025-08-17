namespace CourseMate.Entities.Lessons.Articles;

public class Article : FullAuditedEntity<Guid>
{
    public Article(Guid id, Guid lessonId, string content) : base(id)
    {
        LessonId = lessonId;
        Content = content;
    }

    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConst.ContentMaxLength)]
    public string Content { get; set; }
}