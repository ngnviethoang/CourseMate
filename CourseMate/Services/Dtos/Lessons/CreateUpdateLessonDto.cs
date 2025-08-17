using CourseMate.Entities.Lessons;

namespace CourseMate.Services.Dtos.Lessons;

public class CreateUpdateLessonDto
{
    public LessonType LessonType { get; set; }
    public Guid ChapterId { get; set; }

    [Range(0, int.MaxValue)]
    public int Position { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    public ArticleDto? Article { get; set; }
    public VideoDto? Video { get; set; }
    public CodingExerciseDto? CodingExercise { get; set; }
    public QuizQuestionDto? QuizQuestion { get; set; }
}