using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;

namespace CourseMate.Application.Services.RecommendationServices;

/// <summary>
/// Internal DTOs used by the recommendation engine. Kept here (Application layer) because
/// they are implementation details and never returned to the caller.
/// </summary>
public sealed record ScoredCourse(
    Guid CourseId,
    Guid AnalyticsId,
    double ContentScore,
    double CollaborativeScore,
    double WeaknessScore,
    double PopularityScore,
    double FinalScore,
    List<string> Reasons,
    string Explanation);

public sealed record ScoredContest(
    Guid ContestId,
    double Score,
    List<string> Reasons,
    string Explanation);

public sealed record ScoredExercise(
    Guid ExerciseId,
    double Score,
    List<string> Reasons,
    string Explanation);

public sealed record CategoryAffinity(
    string Category,
    double Affinity,
    bool IsWeak,
    bool IsStrong);

public sealed record StudentSignals(
    Guid StudentId,
    Dictionary<string, double> CategoryAffinityMap,
    List<CategoryAffinity> WeakAreas,
    List<CategoryAffinity> StrongAreas,
    HashSet<Guid> EnrolledCourseIds,
    HashSet<Guid> CompletedLessonIds,
    Dictionary<Guid, double> CourseAffinityMap,
    int TotalAttempts,
    double OverallPassRate);

public enum RecommendationSource
{
    HomePage,
    CourseDetail,
    CategoryPage,
    WeakAreaPage
}
