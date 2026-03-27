using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class LessonReading : Entity
{
    public LessonReading(Guid id, Guid lessonId, string content) : base(id)
    {
        LessonId = lessonId;
        Content = content;
    }

    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Content { get; set; }
}