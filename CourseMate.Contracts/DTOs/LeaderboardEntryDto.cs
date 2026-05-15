namespace CourseMate.Contracts.DTOs;

public class LeaderboardEntryDto
{
    public int Rank { get; set; }
    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public int TotalScore { get; set; }
    public float TotalRuntime { get; set; }
    public DateTimeOffset LastSubmitTime { get; set; }
    public bool IsDisqualified { get; set; }
}