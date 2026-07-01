namespace CourseMate.Application.Services.RecommendationServices;

/// <summary>
/// Tunable weights for the recommendation hybrid scorer. Defaults can be overridden from
/// configuration so instructors/operators can fine-tune the experience per environment.
/// </summary>
public class RecommendationOptions
{
    /// <summary>Weight for content-based scoring (favourite categories, learning goals).</summary>
    public double ContentWeight { get; set; } = 0.35;

    /// <summary>Weight for collaborative filtering (similar students).</summary>
    public double CollaborativeWeight { get; set; } = 0.25;

    /// <summary>Weight for weakness-driven scoring (remedial recommendations).</summary>
    public double WeaknessWeight { get; set; } = 0.30;

    /// <summary>Weight for popularity scoring (rating + enrollment count).</summary>
    public double PopularityWeight { get; set; } = 0.10;

    /// <summary>Threshold below which a (category, difficulty) bucket is flagged as weak.</summary>
    public double WeaknessThreshold { get; set; } = 0.5;

    /// <summary>Number of items returned per category in the response.</summary>
    public int DefaultTopN { get; set; } = 10;

    /// <summary>Maximum number of items returned per category.</summary>
    public int MaxTopN { get; set; } = 50;
}
