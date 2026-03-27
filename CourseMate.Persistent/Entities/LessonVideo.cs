using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class LessonVideo : Entity
{
    public LessonVideo(Guid id, Guid lessonId, string videoUrl) : base(id)
    {
        LessonId = lessonId;
        VideoUrl = videoUrl;
    }

    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string VideoUrl { get; set; }
}