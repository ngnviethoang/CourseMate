namespace CourseMate.Entities.Exercises;

public class Exercise : FullAuditedEntity<Guid>
{
    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Title { get; set; }

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Description { get; set; }

    public ExerciseType Type { get; set; }

    public Guid LessonId { get; set; }

    public Exercise(Guid id, string title, string description, ExerciseType type, Guid lessonId) : base(id)
    {
        Title = title;
        Description = description;
        Type = type;
        LessonId = lessonId;
    }
}