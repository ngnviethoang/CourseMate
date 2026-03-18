using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Infrastructure.Entities.Abstracts;

namespace CourseMate.Infrastructure.Entities;

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