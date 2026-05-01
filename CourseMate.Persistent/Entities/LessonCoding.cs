using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class LessonCoding : Entity
{
    public LessonCoding(Guid id, Guid lessonId, Guid exerciseId) : base(id)
    {
        LessonId = lessonId;
        ExerciseId = exerciseId;
    }

    public Guid LessonId { get; set; }

    public Guid ExerciseId { get; set; }
}