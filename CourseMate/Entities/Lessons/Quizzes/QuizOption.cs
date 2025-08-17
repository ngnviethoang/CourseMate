namespace CourseMate.Entities.Lessons.Quizzes;

public class QuizOption : FullAuditedEntity<Guid>
{
    public QuizOption(Guid id, Guid quizQuestionId, string text, bool isCorrect) : base(id)
    {
        QuizQuestionId = quizQuestionId;
        Text = text;
        IsCorrect = isCorrect;
    }

    public Guid QuizQuestionId { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Text { get; set; }

    public bool IsCorrect { get; set; }
}