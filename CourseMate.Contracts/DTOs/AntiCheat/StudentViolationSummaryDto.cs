namespace CourseMate.Contracts.DTOs.AntiCheat;

public class StudentViolationSummaryDto
{
    public Guid StudentId { get; set; }

    public string StudentName { get; set; } = string.Empty;

    public int ViolationCount { get; set; }

    public bool IsDisqualified { get; set; }

    public DateTimeOffset? DisqualifiedAt { get; set; }

    public string DisqualifiedReason { get; set; } = string.Empty;

    public List<ViolationEntryDto> Violations { get; set; } = [];
}