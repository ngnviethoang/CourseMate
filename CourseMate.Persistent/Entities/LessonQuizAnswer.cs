using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class LessonQuizAnswer : Entity
{
    public LessonQuizAnswer(Guid id, Guid lessonQuizQuestionId, string text, bool isCorrect, int position) : base(id)
    {
        LessonQuizQuestionId = lessonQuizQuestionId;
        Text = text;
        IsCorrect = isCorrect;
        Position = position;
    }

    public Guid LessonQuizQuestionId { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Text { get; set; }

    public bool IsCorrect { get; set; }

    public int Position { get; set; }
}