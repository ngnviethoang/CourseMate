using CourseMate.Entities.Lessons;

namespace CourseMate.Services.Dtos.Lessons;

public class LessonDto : AuditedEntityDto<Guid>
{
    public LessonType LessonType { get; set; }
    public Guid ChapterId { get; set; }
    public int Position { get; set; }
    public string Title { get; set; } = string.Empty;
    public Guid CourseId { get; set; }
    public ArticleDto? Article { get; set; }
    public VideoDto? Video { get; set; }
    public CodingExerciseDto? CodingExercise { get; set; }
    public IEnumerable<QuizQuestionDto> QuizQuestions { get; set; } = [];
}