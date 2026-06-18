using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pgvector;
using Pgvector.EntityFrameworkCore;

namespace CourseMate.Application.BackgroundJobs;

public class BuildCourseSimilarityJob
{
    private readonly CourseMateDbContext _dbContext;
    private readonly ILogger<BuildCourseSimilarityJob> _logger;
    private readonly RecommendationOptions _options;

    public BuildCourseSimilarityJob(
        CourseMateDbContext dbContext,
        IOptions<RecommendationOptions> options,
        ILogger<BuildCourseSimilarityJob> logger)
    {
        _dbContext = dbContext;
        _options = options.Value;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 0)]
    public async Task ExecuteAsync(CancellationToken ct)
    {
        List<CourseEmbeddingRef> embeddings = await (
            from embedding in _dbContext.CourseEmbeddings
            join course in _dbContext.Courses on embedding.CourseId equals course.Id
            where course.IsPublished
            select new CourseEmbeddingRef(embedding.CourseId, embedding.Embedding)).ToListAsync(ct);

        if (embeddings.Count < 2)
        {
            _logger.LogInformation("Not enough course embeddings to build similarities. Count={Count}", embeddings.Count);
            return;
        }

        List<CourseSimilarity> existing = await _dbContext.CourseSimilarities.ToListAsync(ct);
        _dbContext.CourseSimilarities.RemoveRange(existing);

        foreach (CourseEmbeddingRef anchor in embeddings)
        {
            Vector anchorVector = anchor.Embedding;
            List<NeighborScore> neighbors = await _dbContext.CourseEmbeddings
                .Where(e => e.CourseId != anchor.CourseId)
                .Join(_dbContext.Courses.Where(c => c.IsPublished), e => e.CourseId, c => c.Id, (e, _) => e)
                .OrderBy(e => e.Embedding.CosineDistance(anchorVector))
                .Take(_options.TopNeighbors)
                .Select(e => new NeighborScore(e.CourseId, e.Embedding.CosineDistance(anchorVector)))
                .ToListAsync(ct);

            foreach (NeighborScore neighbor in neighbors)
            {
                CourseSimilarity similarity = new(Guid.NewGuid(), anchor.CourseId, neighbor.CourseId, 1.0 - neighbor.Distance);
                await _dbContext.CourseSimilarities.AddAsync(similarity, ct);
            }
        }

        await _dbContext.SaveChangesAsync(ct);
        _logger.LogInformation("Built course similarities for {Count} courses.", embeddings.Count);
    }

    private sealed record CourseEmbeddingRef(Guid CourseId, Vector Embedding);

    private sealed record NeighborScore(Guid CourseId, double Distance);
}
