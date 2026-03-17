using System.ComponentModel.DataAnnotations;
using CourseMate.Contract;
using CourseMate.Core.Entities.Abstracts;

namespace CourseMate.Core.Entities;

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