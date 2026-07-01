namespace CourseMate.Application.Services.RecommendationServices;

/// <summary>
/// Default no-op logger (the service itself performs logging through the write DbContext,
/// but we expose a thin interface so we can swap to Hangfire background jobs later).
/// </summary>
internal sealed class NoopRecommendationLogger : IRecommendationLogger
{
    public Task LogAsync(Guid studentId, string recommendationType, string strategy, int resultCount, double topScore, object payload, CancellationToken ct)
    {
        return Task.CompletedTask;
    }
}
