using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class Lesson : Entity
{
    public Lesson(Guid id, Guid chapterId, Guid courseId, string title, LessonType lessonType, string position) : base(id)
    {
        ChapterId = chapterId;
        CourseId = courseId;
        Title = title;
        LessonType = lessonType;
        Position = position;
    }

    public Guid ChapterId { get; set; }

    public Guid CourseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; }

    public LessonType LessonType { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Position { get; set; }
}