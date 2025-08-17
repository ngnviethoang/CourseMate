namespace CourseMate.Entities.Lessons.Quizzes;

public class QuizQuestion : FullAuditedEntity<Guid>
{
    public QuizQuestion(Guid id, Guid lessonId, string questionText) : base(id)
    {
        LessonId = lessonId;
        QuestionText = questionText;
    }

    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string QuestionText { get; set; }
}