using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class LessonSlide : Entity
{
    public LessonSlide(Guid id, Guid lessonId, string fileUrl) : base(id)
    {
        LessonId = lessonId;
        FileUrl = fileUrl;
    }

    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string FileUrl { get; set; }
}
