using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class UserLessonProgress : Entity
{
    public UserLessonProgress(Guid id, Guid studentId, Guid lessonId, bool isCompleted, double score = 0) : base(id)
    {
        StudentId = studentId;
        LessonId = lessonId;
        IsCompleted = isCompleted;
        Score = score;
    }

    public Guid StudentId { get; set; }

    public Guid LessonId { get; set; }

    public bool IsCompleted { get; set; }

    public double Score { get; set; }
}