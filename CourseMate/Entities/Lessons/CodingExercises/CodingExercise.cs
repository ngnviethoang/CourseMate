namespace CourseMate.Entities.Lessons.CodingExercises;

public class CodingExercise : FullAuditedEntity<Guid>
{
    public CodingExercise(Guid id, Guid lessonId, string title, string description) : base(id)
    {
        LessonId = lessonId;
        Title = title;
        Description = description;
    }

    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Title { get; set; }

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Description { get; set; }
}