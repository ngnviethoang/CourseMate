using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

/// <summary>
/// Snapshot of a recommendation result returned to a student.
/// Used for analytics, A/B testing and to prevent regenerating identical recommendations
/// when no new data is available.
/// </summary>
public class RecommendationLog : Entity
{
    public RecommendationLog(
        Guid id,
        Guid studentId,
        string recommendationType,
        string strategy,
        int resultCount,
        string payload,
        double topScore) : base(id)
    {
        StudentId = studentId;
        RecommendationType = recommendationType;
        Strategy = strategy;
        ResultCount = resultCount;
        Payload = payload;
        TopScore = topScore;
    }

    public Guid StudentId { get; set; }

    /// <summary>"Course", "Contest" or "Exercise".</summary>
    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string RecommendationType { get; set; }

    /// <summary>Composite strategy that produced this batch (e.g. "hybrid-content-collab-weakness").</summary>
    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Strategy { get; set; }

    public int ResultCount { get; set; }

    /// <summary>JSON-serialized snapshot of the recommended ids with scores and reasons.</summary>
    [MaxLength(CourseMateConsts.DescriptionMaxLength)]
    public string Payload { get; set; }

    /// <summary>Highest score in the batch — convenient for offline analysis.</summary>
    public double TopScore { get; set; }
}
