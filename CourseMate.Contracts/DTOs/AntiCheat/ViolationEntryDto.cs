using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs.AntiCheat;

public class ViolationEntryDto
{
    public Guid Id { get; set; }

    public ViolationType ViolationType { get; set; }

    public string Details { get; set; } = string.Empty;

    public DateTimeOffset OccurredAt { get; set; }
}