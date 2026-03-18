using CourseMate.Infrastructure.Entities.Abstracts;

namespace CourseMate.Infrastructure.Entities;

public class UserLessonProgress : Entity
{
    public UserLessonProgress(Guid id, Guid studentId, Guid lessonId, bool isCompleted) : base(id)
    {
        StudentId = studentId;
        LessonId = lessonId;
        IsCompleted = isCompleted;
    }

    public Guid StudentId { get; set; }

    public Guid LessonId { get; set; }

    public bool IsCompleted { get; set; }
}