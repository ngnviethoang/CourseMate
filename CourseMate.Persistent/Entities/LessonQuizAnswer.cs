using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class LessonQuizAnswer : Entity
{
    public LessonQuizAnswer(Guid id, Guid questionId, string text, bool isCorrect, int position) : base(id)
    {
        QuestionId = questionId;
        Text = text;
        IsCorrect = isCorrect;
        Position = position;
    }

    public Guid QuestionId { get; set; }
    public LessonQuizQuestion Question { get; set; }

    public string Text { get; set; }
    public bool IsCorrect { get; set; }
    public int Position { get; set; }
}