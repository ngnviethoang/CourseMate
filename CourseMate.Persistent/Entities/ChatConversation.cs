using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class ChatConversation : Entity
{
    public ChatConversation(Guid id, Guid userId, string title, Guid? courseId, Guid? lessonId) : base(id)
    {
        UserId = userId;
        Title = title;
        CourseId = courseId;
        LessonId = lessonId;
    }

    public Guid UserId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; }

    public Guid? CourseId { get; set; }

    public Guid? LessonId { get; set; }
}
