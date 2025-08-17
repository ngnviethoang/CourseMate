namespace CourseMate.Services.Dtos.Lessons;

public class ArticleDto : EntityDto<Guid>
{
    public Guid LessonId { get; set; }

    public string Content { get; set; } = string.Empty;
}