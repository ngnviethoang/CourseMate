using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class LessonQuizQuestion : Entity
{
    public LessonQuizQuestion(Guid id, Guid lessonQuizId, string text, int position) : base(id)
    {
        LessonQuizId = lessonQuizId;
        Text = text;
        Position = position;
    }

    public Guid LessonQuizId { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Text { get; set; }

    public int Position { get; set; }
}