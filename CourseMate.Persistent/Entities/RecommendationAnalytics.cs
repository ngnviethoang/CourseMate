using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class RecommendationAnalytics : Entity
{
    public RecommendationAnalytics(
        Guid id,
        Guid studentId,
        Guid courseId,
        Guid? enrollmentId,
        double contentScore,
        double collaborativeScore,
        double weaknessScore,
        double popularityScore,
        double finalScore,
        string source,
        string? feedback,
        DateTimeOffset? feedbackTime) : base(id)
    {
        StudentId = studentId;
        CourseId = courseId;
        EnrollmentId = enrollmentId;
        ContentScore = contentScore;
        CollaborativeScore = collaborativeScore;
        WeaknessScore = weaknessScore;
        PopularityScore = popularityScore;
        FinalScore = finalScore;
        Source = source;
        Feedback = feedback;
        FeedbackTime = feedbackTime;
    }

    public Guid StudentId { get; set; }
    public Guid CourseId { get; set; }
    public Guid? EnrollmentId { get; set; }
    public double ContentScore { get; set; }
    public double CollaborativeScore { get; set; }
    public double WeaknessScore { get; set; }
    public double PopularityScore { get; set; }
    public double FinalScore { get; set; }
    public string Source { get; set; } = string.Empty;
    public string? Feedback { get; set; }
    public DateTimeOffset? FeedbackTime { get; set; }
    public DateTimeOffset? EnrolledAt { get; set; }
    public bool IsCompleted { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }
}
