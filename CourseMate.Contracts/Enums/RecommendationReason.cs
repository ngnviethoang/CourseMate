namespace CourseMate.Contracts.Enums;

/// <summary>
/// Reasons why the system surfaced a specific item. The list is reported back to the
/// frontend so it can render an explainable "Why this?" tooltip.
/// </summary>
public enum RecommendationReason
{
    None = 0,
    FavouriteCategory = 1,
    PreferredDifficulty = 2,
    WeakAreaImprovement = 3,
    SimilarToEnrolledCourse = 4,
    SimilarToContestSubmission = 5,
    SimilarToCompletedLesson = 6,
    PopularInCategory = 7,
    InstructorMatch = 8,
    CollaborativeSimilarStudents = 9,
    UpcomingContest = 10,
    FreePractice = 11
}
