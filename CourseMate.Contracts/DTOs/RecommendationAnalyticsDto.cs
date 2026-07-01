namespace CourseMate.Contracts.DTOs;

public enum RecommendationFeedback
{
    Helpful,
    NotHelpful,
    Shown,
    Enrolled,
    Dismissed
}

public record RecommendationAnalyticsDto(
    Guid Id,
    Guid StudentId,
    Guid CourseId,
    Guid? EnrollmentId,
    double ContentScore,
    double CollaborativeScore,
    double WeaknessScore,
    double PopularityScore,
    double FinalScore,
    string Source,
    string? Feedback,
    DateTimeOffset? FeedbackTime,
    DateTimeOffset? EnrolledAt,
    bool IsCompleted,
    DateTimeOffset? CompletedAt,
    DateTimeOffset CreationTime
);

public record RecordFeedbackDto(
    RecommendationFeedback Feedback
);

public record RecommendationAnalyticsSummaryDto(
    int TotalRecommendations,
    int TotalEnrollments,
    int TotalFeedbacks,
    int HelpfulFeedbacks,
    int NotHelpfulFeedbacks,
    double ClickThroughRate,
    double EnrollmentRate,
    double HelpfulRate,
    Dictionary<string, int> RecommendationsBySource,
    Dictionary<string, double> AverageScoresBySource,
    List<CoursePerformanceDto> TopPerformingCourses,
    List<CoursePerformanceDto> WorstPerformingCourses,
    Dictionary<string, double> AverageScoresByCategory
);

public record CoursePerformanceDto(
    Guid CourseId,
    string CourseName,
    int RecommendationCount,
    int EnrollmentCount,
    int CompletionCount,
    double EnrollmentRate,
    double CompletionRate,
    double AverageFeedbackScore
);

public record StudentRecommendationStatsDto(
    Guid StudentId,
    int TotalRecommendationsReceived,
    int TotalEnrollments,
    int CompletedCourses,
    double EngagementRate,
    double CompletionRate,
    List<string> PreferredSources
);
