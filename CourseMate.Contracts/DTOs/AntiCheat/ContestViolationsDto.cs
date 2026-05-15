namespace CourseMate.Contracts.DTOs.AntiCheat;

public class ContestViolationsDto
{
    public Guid ContestId { get; set; }

    public string ContestTitle { get; set; } = string.Empty;

    public List<StudentViolationSummaryDto> Students { get; set; } = [];
}