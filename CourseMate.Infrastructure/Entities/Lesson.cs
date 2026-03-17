using System.ComponentModel.DataAnnotations;
using CourseMate.Contract;
using CourseMate.Contract.Enums;
using CourseMate.Core.Entities.Abstracts;

namespace CourseMate.Core.Entities;

public class Lesson : Entity
{
    public Lesson(Guid id, Guid chapterId, Guid courseId, string title, LessonType lessonType, int position) : base(id)
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

    public int Position { get; set; }
}