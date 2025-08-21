namespace CourseMate.Entities.Lessons.CodingExercises;

public class TestCase : FullAuditedEntity<Guid>
{
    public TestCase(Guid id, Guid codingExerciseId, string input, string output, bool isHidden) : base(id)
    {
        CodingExerciseId = codingExerciseId;
        Input = input;
        Output = output;
        IsHidden = isHidden;
    }

    public Guid CodingExerciseId { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Input { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Output { get; set; }

    public bool IsHidden { get; set; }
}