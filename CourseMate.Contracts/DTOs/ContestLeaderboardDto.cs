namespace CourseMate.Contracts.DTOs;

public class ContestLeaderboardDto
{
    public Guid ContestId { get; set; }
    public string ContestTitle { get; set; } = string.Empty;
    public List<LeaderboardEntryDto> Entries { get; set; } = [];
}