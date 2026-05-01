using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class LessonQuizQuestion : Entity
{
    public LessonQuizQuestion(Guid id, Guid quizId, string text, int position) : base(id)
    {
        QuizId = quizId;
        Text = text;
        Position = position;
    }

    public Guid QuizId { get; set; }
    public LessonQuiz Quiz { get; set; }

    public string Text { get; set; }
    public int Position { get; set; }

    public ICollection<LessonQuizAnswer> Answers { get; set; } = new List<LessonQuizAnswer>();
}
