namespace CourseMate.Entities.Lessons;

public class TestCase : FullAuditedEntity<Guid>
{
    public TestCase(Guid id, string input, string expectedOutput, bool isHidden, Guid lessonId) : base(id)
    {
        Input = input;
        ExpectedOutput = expectedOutput;
        IsHidden = isHidden;
        LessonId = lessonId;
    }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Input { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string ExpectedOutput { get; set; }

    public bool IsHidden { get; set; }

    public Guid LessonId { get; set; }
}