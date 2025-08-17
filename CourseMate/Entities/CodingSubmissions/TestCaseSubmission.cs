namespace CourseMate.Entities.CodingSubmissions;

public class TestCaseSubmission : FullAuditedEntity<Guid>
{
    public TestCaseSubmission(Guid id, Guid codingSubmissionId, Guid testCaseId, string actualOutput, bool isPassed, TimeSpan executionTime) : base(id)
    {
        CodingSubmissionId = codingSubmissionId;
        TestCaseId = testCaseId;
        ActualOutput = actualOutput;
        IsPassed = isPassed;
        ExecutionTime = executionTime;
    }

    public Guid CodingSubmissionId { get; set; }

    public Guid TestCaseId { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string ActualOutput { get; set; }

    public bool IsPassed { get; set; }

    public TimeSpan ExecutionTime { get; set; }
}