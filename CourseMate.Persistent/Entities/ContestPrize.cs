using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class ContestPrize : Entity
{
    public ContestPrize(Guid id, Guid contestId, Guid courseId, int minRank, int maxRank)
        : base(id)
    {
        ContestId = contestId;
        CourseId = courseId;
        MinRank = minRank;
        MaxRank = maxRank;
    }

    public Guid ContestId { get; set; }

    public Guid CourseId { get; set; }

    /// <summary>
    /// The lowest rank (best position) that wins this prize. Example: 1
    /// </summary>
    public int MinRank { get; set; }

    /// <summary>
    /// The highest rank (worst position) that wins this prize. Example: 3 (Top 1-3)
    /// </summary>
    public int MaxRank { get; set; }
}
