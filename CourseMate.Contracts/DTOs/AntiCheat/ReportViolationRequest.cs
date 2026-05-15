using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs.AntiCheat;

public class ReportViolationRequest
{
    public Guid ContestId { get; set; }

    public ViolationType ViolationType { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Details { get; set; } = string.Empty;

    public DateTimeOffset Timestamp { get; set; }
}