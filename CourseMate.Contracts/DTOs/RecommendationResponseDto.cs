using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs;

/// <summary>
/// Aggregated recommendation response containing three ranked lists
/// (courses, contests, exercises) and an explainability payload describing
/// which signals contributed to each suggestion.
/// </summary>
public class RecommendationResponseDto
{
    public Guid StudentId { get; set; }

    public List<RecommendedCourseDto> Courses { get; set; } = new();

    public List<RecommendedContestDto> Contests { get; set; } = new();

    public List<RecommendedExerciseDto> Exercises { get; set; } = new();

    /// <summary>Categories the system believes the student is currently weak in.</summary>
    public List<string> WeakAreas { get; set; } = new();

    /// <summary>Categories the student has mastered — useful for "stretch" suggestions.</summary>
    public List<string> StrongAreas { get; set; } = new();

    /// <summary>Strategy string used by the engine for this response (for debugging / audit).</summary>
    public string Strategy { get; set; } = "hybrid-content-collab-weakness";

    public DateTimeOffset GeneratedAt { get; set; }
}

public class RecommendedCourseDto
{
    public Guid CourseId { get; set; }

    /// <summary>Used for recording feedback. Send this to POST /api/recommendations/{analyticsId}/feedback</summary>
    public Guid AnalyticsId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string CategoryName { get; set; } = string.Empty;

    public string InstructorName { get; set; } = string.Empty;

    public double AverageRating { get; set; }

    public int EnrollmentCount { get; set; }

    /// <summary>0..1 normalized relevance score combining content, collaborative and weakness signals.</summary>
    public double Score { get; set; }

    public List<RecommendationReason> Reasons { get; set; } = new();

    public string Explanation { get; set; } = string.Empty;
}

public class RecommendedContestDto
{
    public Guid ContestId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public ContestStatus Status { get; set; }

    public DateTimeOffset? StartTime { get; set; }

    public DateTimeOffset? EndTime { get; set; }

    public int DurationInMinutes { get; set; }

    public int ExerciseCount { get; set; }

    public int ParticipantCount { get; set; }

    public double Score { get; set; }

    public List<RecommendationReason> Reasons { get; set; } = new();

    public string Explanation { get; set; } = string.Empty;
}

public class RecommendedExerciseDto
{
    public Guid ExerciseId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Difficulty { get; set; } = string.Empty;

    public int TestCaseCount { get; set; }

    public double Score { get; set; }

    public List<RecommendationReason> Reasons { get; set; } = new();

    public string Explanation { get; set; } = string.Empty;
}
