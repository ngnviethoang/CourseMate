using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class UserRecommendation : Entity
{
    public UserRecommendation(Guid id, Guid userId, Guid courseId, double score, int rank, DateTimeOffset generatedAt) : base(id)
    {
        UserId = userId;
        CourseId = courseId;
        Score = score;
        Rank = rank;
        GeneratedAt = generatedAt;
    }

    public Guid UserId { get; set; }

    public Guid CourseId { get; set; }

    public double Score { get; set; }

    public int Rank { get; set; }

    public DateTimeOffset GeneratedAt { get; set; }
}