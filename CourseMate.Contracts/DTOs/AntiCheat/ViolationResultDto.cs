namespace CourseMate.Contracts.DTOs.AntiCheat;

public class ViolationResultDto
{
    public int ViolationCount { get; set; }

    public int MaxViolations { get; set; }

    public bool IsDisqualified { get; set; }

    public string Message { get; set; } = string.Empty;
}