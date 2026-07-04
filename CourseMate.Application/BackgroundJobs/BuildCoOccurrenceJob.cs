using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.BackgroundJobs;

public class BuildCoOccurrenceJob
{
    private readonly CourseMateDbContext _dbContext;
    private readonly ILogger<BuildCoOccurrenceJob> _logger;
    private readonly RecommendationOptions _options;

    public BuildCoOccurrenceJob(
        CourseMateDbContext dbContext,
        IOptions<RecommendationOptions> options,
        ILogger<BuildCoOccurrenceJob> logger)
    {
        _dbContext = dbContext;
        _options = options.Value;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 0)]
    public async Task ExecuteAsync(CancellationToken ct)
    {
        List<EnrollmentRef> enrollments = await _dbContext.Enrollments
            .Select(e => new EnrollmentRef(e.StudentId, e.CourseId))
            .ToListAsync(ct);

        Dictionary<Guid, List<Guid>> coursesByUser = enrollments
            .GroupBy(e => e.StudentId)
            .ToDictionary(g => g.Key, g => g.Select(e => e.CourseId).Distinct().ToList());

        Dictionary<Guid, int> courseCounts = new();
        Dictionary<(Guid, Guid), int> pairCounts = new();
        foreach (List<Guid> courses in coursesByUser.Values)
        {
            foreach (Guid course in courses)
            {
                courseCounts[course] = courseCounts.GetValueOrDefault(course) + 1;
            }

            for (int i = 0; i < courses.Count; i++)
            {
                for (int j = i + 1; j < courses.Count; j++)
                {
                    AddPair(pairCounts, courses[i], courses[j]);
                    AddPair(pairCounts, courses[j], courses[i]);
                }
            }
        }

        if (pairCounts.Count == 0)
        {
            _logger.LogInformation("No co-occurrence pairs found.");
            return;
        }

        List<CourseCoOccurrence> existing = await _dbContext.CourseCoOccurrences.ToListAsync(ct);
        _dbContext.CourseCoOccurrences.RemoveRange(existing);

        IEnumerable<CourseCoOccurrence> records = pairCounts
            .GroupBy(pair => pair.Key.Item1)
            .SelectMany(group => group
                .Select(pair =>
                {
                    Guid courseA = pair.Key.Item1;
                    Guid courseB = pair.Key.Item2;
                    int coCount = pair.Value;
                    double weight = coCount / Math.Sqrt(courseCounts[courseA] * (double)courseCounts[courseB]);
                    return new CourseCoOccurrence(Guid.NewGuid(), courseA, courseB, weight, coCount);
                })
                .OrderByDescending(record => record.Weight)
                .Take(_options.TopNeighbors));

        await _dbContext.CourseCoOccurrences.AddRangeAsync(records, ct);
        await _dbContext.SaveChangesAsync(ct);
        _logger.LogInformation("Built co-occurrences from {Count} enrollments.", enrollments.Count);
    }

    private static void AddPair(Dictionary<(Guid, Guid), int> pairCounts, Guid from, Guid to)
    {
        (Guid, Guid) key = (from, to);
        pairCounts[key] = pairCounts.GetValueOrDefault(key) + 1;
    }

    private sealed record EnrollmentRef(Guid StudentId, Guid CourseId);
}