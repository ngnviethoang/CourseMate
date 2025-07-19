namespace CourseMate.Entities.Exercises.CodingExercises;

public class CodingExercise : FullAuditedEntity<Guid>
{
    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string InitialCode { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Language { get; set; }

    public Guid ExerciseId { get; set; }

    public CodingExercise(Guid id, string initialCode, string language, Guid exerciseId) : base(id)
    {
        InitialCode = initialCode;
        Language = language;
        ExerciseId = exerciseId;
    }
}