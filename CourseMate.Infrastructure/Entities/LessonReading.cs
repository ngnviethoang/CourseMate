using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Infrastructure.Entities.Abstracts;

namespace CourseMate.Infrastructure.Entities;

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