namespace CourseMate.Entities.Exercises.CodingExercises;

public class TestCase : FullAuditedEntity<Guid>
{
    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Input { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string ExpectedOutput { get; set; }

    public bool IsHidden { get; set; }

    public Guid CodingExerciseId { get; set; }

    public TestCase(Guid id, string input, string expectedOutput, bool isHidden, Guid codingExerciseId) : base(id)
    {
        Input = input;
        ExpectedOutput = expectedOutput;
        IsHidden = isHidden;
        CodingExerciseId = codingExerciseId;
    }
}