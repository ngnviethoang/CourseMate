using System.ComponentModel.DataAnnotations;
using CourseMate.Contract;
using CourseMate.Core.Entities.Abstracts;

namespace CourseMate.Core.Entities;

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