using CourseMate.Entities.Lessons;

namespace CourseMate.Entities.CodingSubmissions;

public class CodingSubmission : FullAuditedEntity<Guid>
{
    public CodingSubmission(Guid id, Guid codingExerciseId, Guid userId, string sourceCode, LanguageType language, bool isPassed, string error, TimeSpan totalExecutionTime) : base(id)
    {
        CodingExerciseId = codingExerciseId;
        UserId = userId;
        SourceCode = sourceCode;
        Language = language;
        IsPassed = isPassed;
        Error = error;
        TotalExecutionTime = totalExecutionTime;
    }

    public Guid CodingExerciseId { get; set; }

    public Guid UserId { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string SourceCode { get; set; }

    public LanguageType Language { get; set; }

    public bool IsPassed { get; set; }

    public string Error { get; set; }

    public TimeSpan TotalExecutionTime { get; set; }
}