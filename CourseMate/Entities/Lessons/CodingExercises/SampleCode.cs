namespace CourseMate.Entities.Lessons.CodingExercises;

public class SampleCode : FullAuditedEntity<Guid>
{
    public Guid CodingExerciseId { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Code { get; set; }

    public LanguageType LanguageType { get; set; }

    public SampleCode(Guid id, Guid codingExerciseId, string code, LanguageType languageType) : base(id)
    {
        CodingExerciseId = codingExerciseId;
        Code = code;
        LanguageType = languageType;
    }
}