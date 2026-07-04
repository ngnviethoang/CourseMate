using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.BackgroundJobs;

public class BuildUserRecommendationsJob
{
    private readonly CourseMateDbContext _dbContext;
    private readonly ILogger<BuildUserRecommendationsJob> _logger;
    private readonly RecommendationOptions _options;

    public BuildUserRecommendationsJob(
        CourseMateDbContext dbContext,
        IOptions<RecommendationOptions> options,
        ILogger<BuildUserRecommendationsJob> logger)
    {
        _dbContext = dbContext;
        _options = options.Value;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 0)]
    public async Task ExecuteAsync(CancellationToken ct)
    {
        DateTimeOffset generatedAt = DateTimeOffset.UtcNow;
        Dictionary<Guid, float[]> embeddings = (await _dbContext.CourseEmbeddings.ToListAsync(ct))
            .ToDictionary(e => e.CourseId, e => e.Embedding.ToArray());

        Dictionary<Guid, Guid> courseCategory = await _dbContext.Courses
            .Where(c => c.IsPublished)
            .ToDictionaryAsync(c => c.Id, c => c.CategoryId, ct);

        List<EnrollmentRef> enrollments = await _dbContext.Enrollments
            .Select(e => new EnrollmentRef(e.StudentId, e.CourseId))
            .ToListAsync(ct);

        Dictionary<Guid, int> popularity = enrollments
            .GroupBy(e => e.CourseId)
            .ToDictionary(g => g.Key, g => g.Count());
        int maxPopularity = popularity.Count > 0 ? popularity.Values.Max() : 1;

        Dictionary<Guid, List<NeighborScore>> similarityMap = (await _dbContext.CourseSimilarities.ToListAsync(ct))
            .GroupBy(s => s.CourseId)
            .ToDictionary(g => g.Key, g => g.Select(s => new NeighborScore(s.SimilarCourseId, s.Score)).ToList());

        Dictionary<Guid, List<NeighborScore>> coOccurrenceMap = (await _dbContext.CourseCoOccurrences.ToListAsync(ct))
            .GroupBy(c => c.CourseId)
            .ToDictionary(g => g.Key, g => g.Select(c => new NeighborScore(c.CoCourseId, c.Weight)).ToList());

        Dictionary<Guid, List<Guid>> coursesByUser = enrollments
            .GroupBy(e => e.StudentId)
            .ToDictionary(g => g.Key, g => g.Select(e => e.CourseId).Distinct().ToList());

        List<UserRecommendation> existing = await _dbContext.UserRecommendations.ToListAsync(ct);
        _dbContext.UserRecommendations.RemoveRange(existing);

        foreach ((Guid userId, List<Guid> ownedCourses) in coursesByUser)
        {
            HashSet<Guid> owned = [.. ownedCourses];
            HashSet<Guid> ownedCategories = [.. ownedCourses.Where(courseCategory.ContainsKey).Select(c => courseCategory[c])];
            float[]? profile = BuildProfile(ownedCourses, embeddings);

            Dictionary<Guid, double> contentScores = new();
            Dictionary<Guid, double> behaviorScores = new();
            foreach (Guid ownedCourse in ownedCourses)
            {
                if (similarityMap.TryGetValue(ownedCourse, out List<NeighborScore>? similar))
                {
                    foreach (NeighborScore neighbor in similar)
                    {
                        contentScores[neighbor.CourseId] = Math.Max(contentScores.GetValueOrDefault(neighbor.CourseId), neighbor.Score);
                    }
                }

                if (coOccurrenceMap.TryGetValue(ownedCourse, out List<NeighborScore>? coOccurring))
                {
                    foreach (NeighborScore neighbor in coOccurring)
                    {
                        behaviorScores[neighbor.CourseId] = behaviorScores.GetValueOrDefault(neighbor.CourseId) + neighbor.Score;
                    }
                }
            }

            HashSet<Guid> candidates = [.. contentScores.Keys, .. behaviorScores.Keys];
            List<ScoredCourse> scored = [];
            foreach (Guid candidate in candidates)
            {
                if (owned.Contains(candidate) || !courseCategory.ContainsKey(candidate))
                {
                    continue;
                }

                double contentSim = profile != null && embeddings.TryGetValue(candidate, out float[]? candidateVector)
                    ? CosineSimilarity(profile, candidateVector)
                    : contentScores.GetValueOrDefault(candidate);
                double behavior = behaviorScores.GetValueOrDefault(candidate);
                double categoryAffinity = ownedCategories.Contains(courseCategory[candidate]) ? 1.0 : 0.0;
                double popularityScore = popularity.GetValueOrDefault(candidate) / (double)maxPopularity;

                double score = _options.ContentWeight * contentSim
                               + _options.BehaviorWeight * behavior
                               + _options.CategoryWeight * categoryAffinity
                               + _options.PopularityWeight * popularityScore;
                scored.Add(new ScoredCourse(candidate, score));
            }

            int rank = 1;
            foreach (ScoredCourse item in scored.OrderByDescending(s => s.Score).Take(_options.TopRecommendations))
            {
                UserRecommendation recommendation = new(Guid.NewGuid(), userId, item.CourseId, item.Score, rank, generatedAt);
                await _dbContext.UserRecommendations.AddAsync(recommendation, ct);
                rank++;
            }
        }

        await _dbContext.SaveChangesAsync(ct);
        _logger.LogInformation("Built recommendations for {Count} users.", coursesByUser.Count);
    }

    private static float[]? BuildProfile(List<Guid> ownedCourses, Dictionary<Guid, float[]> embeddings)
    {
        List<float[]> vectors = ownedCourses.Where(embeddings.ContainsKey).Select(c => embeddings[c]).ToList();
        if (vectors.Count == 0)
        {
            return null;
        }

        int dimensions = vectors[0].Length;
        float[] profile = new float[dimensions];
        foreach (float[] vector in vectors)
        {
            for (int i = 0; i < dimensions; i++)
            {
                profile[i] += vector[i];
            }
        }

        for (int i = 0; i < dimensions; i++)
        {
            profile[i] /= vectors.Count;
        }

        return profile;
    }

    private static double CosineSimilarity(float[] a, float[] b)
    {
        if (a.Length != b.Length)
        {
            return 0;
        }

        double dot = 0;
        double normA = 0;
        double normB = 0;
        for (int i = 0; i < a.Length; i++)
        {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        if (normA == 0 || normB == 0)
        {
            return 0;
        }

        return dot / (Math.Sqrt(normA) * Math.Sqrt(normB));
    }

    private sealed record EnrollmentRef(Guid StudentId, Guid CourseId);

    private sealed record NeighborScore(Guid CourseId, double Score);

    private sealed record ScoredCourse(Guid CourseId, double Score);
}