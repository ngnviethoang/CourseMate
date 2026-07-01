using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs;

/// <summary>
/// Snapshot of how well a student performs in a single (category, difficulty) bucket.
/// Returned by the weakness-analysis endpoint and used to render progress dashboards.
/// </summary>
public class StudentSkillProfileDto
{
    public string Category { get; set; } = string.Empty;

    public ExerciseDifficultyType Difficulty { get; set; }

    public int TotalAttempts { get; set; }

    public int PassedAttempts { get; set; }

    public double PassRate => TotalAttempts == 0 ? 0 : Math.Round((double)PassedAttempts / TotalAttempts * 100, 2);

    public double AverageScore { get; set; }

    public double AverageRuntime { get; set; }

    /// <summary>0..1 — higher means the student masters this area better.</summary>
    public double MasteryScore { get; set; }

    public bool IsWeakArea { get; set; }

    public DateTimeOffset LastAttemptedAt { get; set; }
}
