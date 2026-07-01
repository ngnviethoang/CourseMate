using System.Text.Json;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Services.RecommendationServices;

/// <summary>
/// Entry-point service that orchestrates the recommendation pipeline:
///   1. Collect signals  (preferences + skill profile + collaborative evidence)
///   2. Score courses, contests, exercises via the hybrid scorer
///   3. Persist a snapshot to <see cref="RecommendationLog"/> for analytics
///   4. Return a <see cref="RecommendationResponseDto"/> ready for the client.
/// </summary>
public sealed class RecommendationService : IRecommendationService
{
    private readonly CourseMateDbContext _writeDb;
    private readonly CourseMateReadOnlyDbContext _readDb;
    private readonly IRecommendationSignalCollector _signalCollector;
    private readonly IRecommendationScorer _scorer;
    private readonly IRecommendationLogger _logger;
    private readonly IRecommendationAnalyticsService _analyticsService;
    private readonly RecommendationOptions _options;

    public RecommendationService(
        CourseMateDbContext writeDb,
        CourseMateReadOnlyDbContext readDb,
        IRecommendationSignalCollector signalCollector,
        IRecommendationScorer scorer,
        IRecommendationLogger logger,
        IRecommendationAnalyticsService analyticsService,
        IOptions<RecommendationOptions> options)
    {
        _writeDb = writeDb;
        _readDb = readDb;
        _signalCollector = signalCollector;
        _scorer = scorer;
        _logger = logger;
        _analyticsService = analyticsService;
        _options = options.Value;
    }

    public async Task<RecommendationResponseDto> GetRecommendationsAsync(Guid studentId, int topN, CancellationToken ct)
    {
        int safeTop = Math.Clamp(topN <= 0 ? _options.DefaultTopN : topN, 1, _options.MaxTopN);

        StudentSignals signals = await _signalCollector.CollectSignalsAsync(studentId, ct);

        List<ScoredCourse> coursesTask = await _scorer.ScoreCoursesAsync(signals, safeTop, ct);
        List<ScoredContest> contestsTask = await _scorer.ScoreContestsAsync(signals, safeTop, ct);
        List<ScoredExercise> exercisesTask = await _scorer.ScoreExercisesAsync(signals, safeTop, ct);

        List<RecommendedCourseDto> courses = await MapCoursesAsync(coursesTask, ct);
        List<RecommendedContestDto> contests = await MapContestsAsync(contestsTask, ct);
        List<RecommendedExerciseDto> exercises = await MapExercisesAsync(exercisesTask, ct);

        RecommendationResponseDto response = new()
        {
            StudentId = studentId,
            Courses = courses,
            Contests = contests,
            Exercises = exercises,
            WeakAreas = signals.WeakAreas.Select(w => w.Category).ToList(),
            StrongAreas = signals.StrongAreas.Select(s => s.Category).ToList(),
            Strategy = "hybrid-content-collab-weakness",
            GeneratedAt = DateTimeOffset.UtcNow
        };

        await LogAsync(studentId, response, ct);
        return response;
    }

    public async Task<int> RebuildSkillProfileAsync(Guid studentId, CancellationToken ct)
    {
        // Aggregate per (category, difficulty) from both free exercises and contests.
        var exerciseStats = await _readDb.ExerciseSubmissions
            .Where(s => s.UserId == studentId)
            .Join(_readDb.Exercises, s => s.ExerciseId, e => e.Id, (s, e) => new { s.IsPassed, s.Score, s.TotalTime, s.CreationTime, e.Category, e.Difficulty })
            .GroupBy(x => new { x.Category, x.Difficulty })
            .Select(g => new
            {
                g.Key.Category,
                g.Key.Difficulty,
                Total = g.Count(),
                Passed = g.Count(x => x.IsPassed),
                AvgScore = g.Average(x => (double?)x.Score) ?? 0,
                AvgRuntime = g.Average(x => (double?)x.TotalTime) ?? 0,
                Last = g.Max(x => (DateTimeOffset?)x.CreationTime)
            })
            .ToListAsync(ct);

        var contestStats = await _readDb.ContestSubmissions
            .Where(s => s.StudentId == studentId)
            .Join(_readDb.Exercises, s => s.ExerciseId, e => e.Id, (s, e) => new { s.Score, s.TotalTime, e.Category, e.Difficulty })
            .GroupBy(x => new { x.Category, x.Difficulty })
            .Select(g => new
            {
                g.Key.Category,
                g.Key.Difficulty,
                Total = g.Count(),
                Passed = g.Count(x => x.Score > 0),
                AvgScore = g.Average(x => (double?)x.Score) ?? 0,
                AvgRuntime = g.Average(x => (double?)x.TotalTime) ?? 0
            })
            .ToListAsync(ct);

        Dictionary<(string, int), (int total, int passed, double score, double runtime, DateTimeOffset last)> aggregate = new();
        foreach (var e in exerciseStats)
        {
            aggregate[(e.Category, (int)e.Difficulty)] = (e.Total, e.Passed, e.AvgScore, e.AvgRuntime, e.Last ?? DateTimeOffset.UtcNow);
        }
        foreach (var c in contestStats)
        {
            var key = (c.Category, (int)c.Difficulty);
            if (aggregate.TryGetValue(key, out var existing))
            {
                aggregate[key] = (existing.total + c.Total, existing.passed + c.Passed, (existing.score + c.AvgScore) / 2, (existing.runtime + c.AvgRuntime) / 2, existing.last);
            }
            else
            {
                aggregate[key] = (c.Total, c.Passed, c.AvgScore, c.AvgRuntime, DateTimeOffset.UtcNow);
            }
        }

        // Wipe existing rows for the student and re-insert to keep the table small.
        List<StudentSkillProfile> existingProfiles = await _readDb.StudentSkillProfiles
            .Where(p => p.StudentId == studentId)
            .ToListAsync(ct);
        foreach (StudentSkillProfile old in existingProfiles)
        {
            StudentSkillProfile tracked = await _writeDb.StudentSkillProfiles.FindAsync(new object[] { old.Id }, ct);
            if (tracked != null)
            {
                _writeDb.StudentSkillProfiles.Remove(tracked);
            }
        }
        await _writeDb.SaveChangesAsync(ct);

        foreach (KeyValuePair<(string, int), (int total, int passed, double score, double runtime, DateTimeOffset last)> kvp in aggregate)
        {
            double mastery = ComputeMasteryScore(kvp.Value.total, kvp.Value.passed, kvp.Value.score);
            StudentSkillProfile profile = new(
                Guid.NewGuid(),
                studentId,
                kvp.Key.Item1,
                (ExerciseDifficultyType)kvp.Key.Item2,
                kvp.Value.total,
                kvp.Value.passed,
                Math.Round(kvp.Value.score, 2),
                Math.Round(kvp.Value.runtime, 2),
                Math.Round(mastery, 4),
                mastery < _options.WeaknessThreshold);
            profile.LastAttemptedAt = kvp.Value.last;
            await _writeDb.StudentSkillProfiles.AddAsync(profile, ct);
        }

        await _writeDb.SaveChangesAsync(ct);
        return aggregate.Count;
    }

    public async Task<StudentPreferenceDto> UpsertPreferenceAsync(Guid studentId, UpsertStudentPreferenceRequest request, CancellationToken ct)
    {
        StudentPreference? existing = await _writeDb.StudentPreferences
            .FirstOrDefaultAsync(x => x.StudentId == studentId, ct);

        if (existing != null)
        {
            existing.FavouriteCategories = (request.FavouriteCategories ?? new()).Where(c => !string.IsNullOrWhiteSpace(c)).ToList();
            existing.PreferredDifficulty = request.PreferredDifficulty;
            existing.LearningGoal = request.LearningGoal ?? string.Empty;
            existing.MinutesPerDay = request.MinutesPerDay;
            existing.SkillLevel = request.SkillLevel ?? "beginner";
            existing.RecommendContests = request.RecommendContests;
            existing.RecommendExercises = request.RecommendExercises;
            existing.AutoRefresh = request.AutoRefresh;
        }
        else
        {
            existing = new StudentPreference(
                Guid.NewGuid(),
                studentId,
                (request.FavouriteCategories ?? new()).Where(c => !string.IsNullOrWhiteSpace(c)).ToList(),
                request.PreferredDifficulty,
                request.LearningGoal ?? string.Empty,
                request.MinutesPerDay,
                request.SkillLevel ?? "beginner",
                request.RecommendContests,
                request.RecommendExercises,
                request.AutoRefresh);
            await _writeDb.StudentPreferences.AddAsync(existing, ct);
        }

        await _writeDb.SaveChangesAsync(ct);
        return MapPreference(existing);
    }

    public async Task<StudentPreferenceDto?> GetPreferenceAsync(Guid studentId, CancellationToken ct)
    {
        StudentPreference? existing = await _readDb.StudentPreferences
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.StudentId == studentId, ct);
        return existing == null ? null : MapPreference(existing);
    }

    public async Task<List<StudentSkillProfileDto>> GetSkillProfileAsync(Guid studentId, CancellationToken ct)
    {
        List<StudentSkillProfile> rows = await _readDb.StudentSkillProfiles
            .AsNoTracking()
            .Where(p => p.StudentId == studentId)
            .OrderByDescending(p => p.MasteryScore)
            .ToListAsync(ct);
        return rows.Select(MapProfile).ToList();
    }

    public async Task<List<StudentSkillProfileDto>> GetWeakAreasAsync(Guid studentId, CancellationToken ct)
    {
        List<StudentSkillProfile> rows = await _readDb.StudentSkillProfiles
            .AsNoTracking()
            .Where(p => p.StudentId == studentId && p.IsWeakArea)
            .OrderBy(p => p.MasteryScore)
            .ToListAsync(ct);
        return rows.Select(MapProfile).ToList();
    }

    private static double ComputeMasteryScore(int total, int passed, double avgScore)
    {
        if (total == 0)
        {
            return 0;
        }

        double passRate = (double)passed / total;
        double scoreRate = Math.Clamp(avgScore / 100d, 0, 1);
        // Weighted average — pass rate is more important.
        return Math.Round(passRate * 0.7 + scoreRate * 0.3, 4);
    }

    private async Task<List<RecommendedCourseDto>> MapCoursesAsync(List<ScoredCourse> rows, CancellationToken ct)
    {
        if (rows.Count == 0)
        {
            return new List<RecommendedCourseDto>();
        }

        List<Guid> ids = rows.Select(r => r.CourseId).ToList();
        var courseRows = await _readDb.Courses
            .Where(c => ids.Contains(c.Id))
            .Join(_readDb.Categories, c => c.CategoryId, cat => cat.Id, (c, cat) => new { c, cat })
            .Join(_readDb.Users, x => x.c.InstructorId, u => u.Id, (x, u) => new
            {
                x.c.Id,
                x.c.Title,
                x.c.Description,
                x.c.ImageUrl,
                x.c.Price,
                x.cat.Name,
                InstructorName = u.UserName
            })
            .ToListAsync(ct);

        Dictionary<Guid, (string Title, string Description, string ImageUrl, decimal Price, string CategoryName, string InstructorName)> lookup =
            courseRows.ToDictionary(
                x => x.Id,
                x => (x.Title, x.Description, x.ImageUrl, x.Price, x.Name, x.InstructorName ?? string.Empty));

        return rows.Select(r =>
        {
            lookup.TryGetValue(r.CourseId, out var info);
            return new RecommendedCourseDto
            {
                CourseId = r.CourseId,
                AnalyticsId = r.AnalyticsId,
                Title = info.Title,
                Description = info.Description,
                ImageUrl = info.ImageUrl,
                Price = info.Price,
                CategoryName = info.CategoryName,
                InstructorName = info.InstructorName,
                Score = Math.Round(r.FinalScore, 4),
                Reasons = r.Reasons.Select(Enum.Parse<RecommendationReason>).ToList(),
                Explanation = r.Explanation
            };
        }).ToList();
    }

    private async Task<List<RecommendedContestDto>> MapContestsAsync(List<ScoredContest> rows, CancellationToken ct)
    {
        if (rows.Count == 0)
        {
            return new List<RecommendedContestDto>();
        }

        List<Guid> ids = rows.Select(r => r.ContestId).ToList();
        Dictionary<Guid, ContestDto> contestLookup = await _readDb.Contests
            .Where(c => ids.Contains(c.Id))
            .Join(_readDb.Users, c => c.CreatorId, u => u.Id, (c, u) => new { c, CreatorName = u.UserName ?? string.Empty })
            .ToDictionaryAsync(x => x.c.Id, x => new ContestDto
            {
                Id = x.c.Id,
                Title = x.c.Title,
                Description = x.c.Description,
                Status = x.c.Status,
                StartTime = x.c.StartTime,
                EndTime = x.c.EndTime,
                DurationInMinutes = x.c.DurationInMinutes,
                CreatorName = x.CreatorName,
                CreationTime = x.c.CreationTime
            }, ct);

        return rows.Select(r =>
        {
            contestLookup.TryGetValue(r.ContestId, out var info);
            return new RecommendedContestDto
            {
                ContestId = r.ContestId,
                Title = info.Title,
                Description = info.Description,
                Status = info.Status,
                StartTime = info.StartTime,
                EndTime = info.EndTime,
                DurationInMinutes = info.DurationInMinutes,
                Score = Math.Round(r.Score, 4),
                Reasons = r.Reasons.Select(Enum.Parse<RecommendationReason>).ToList(),
                Explanation = r.Explanation
            };
        }).ToList();
    }

    private async Task<List<RecommendedExerciseDto>> MapExercisesAsync(List<ScoredExercise> rows, CancellationToken ct)
    {
        if (rows.Count == 0)
        {
            return new List<RecommendedExerciseDto>();
        }

        List<Guid> ids = rows.Select(r => r.ExerciseId).ToList();
        Dictionary<Guid, ExerciseDto> lookup = await _readDb.Exercises
            .Where(e => ids.Contains(e.Id))
            .Join(_readDb.Users, e => e.CreatorId, u => u.Id, (e, u) => new { e, u })
            .GroupJoin(_readDb.ExerciseTestCases, x => x.e.Id, t => t.ExerciseId, (x, tc) => new { x.e, x.u, TestCaseCount = tc.Count() })
            .ToDictionaryAsync(x => x.e.Id, x => new ExerciseDto
            {
                Id = x.e.Id,
                Title = x.e.Title,
                Description = x.e.Description,
                Difficulty = x.e.Difficulty.ToString(),
                Category = x.e.Category,
                CreatedByName = x.u.UserName,
                TestCaseCount = x.TestCaseCount
            }, ct);

        return rows.Select(r =>
        {
            lookup.TryGetValue(r.ExerciseId, out var info);
            return new RecommendedExerciseDto
            {
                ExerciseId = r.ExerciseId,
                Title = info.Title,
                Description = info.Description,
                Category = info.Category,
                Difficulty = info.Difficulty,
                TestCaseCount = info.TestCaseCount,
                Score = Math.Round(r.Score, 4),
                Reasons = r.Reasons.Select(Enum.Parse<RecommendationReason>).ToList(),
                Explanation = r.Explanation
            };
        }).ToList();
    }

    private static StudentPreferenceDto MapPreference(StudentPreference p)
    {
        return new StudentPreferenceDto
        {
            Id = p.Id,
            StudentId = p.StudentId,
            FavouriteCategories = p.FavouriteCategories.ToList(),
            PreferredDifficulty = p.PreferredDifficulty,
            LearningGoal = p.LearningGoal,
            MinutesPerDay = p.MinutesPerDay,
            SkillLevel = p.SkillLevel,
            RecommendContests = p.RecommendContests,
            RecommendExercises = p.RecommendExercises,
            AutoRefresh = p.AutoRefresh
        };
    }

    private static StudentSkillProfileDto MapProfile(StudentSkillProfile p)
    {
        return new StudentSkillProfileDto
        {
            Category = p.Category,
            Difficulty = p.Difficulty,
            TotalAttempts = p.TotalAttempts,
            PassedAttempts = p.PassedAttempts,
            AverageScore = Math.Round(p.AverageScore, 2),
            AverageRuntime = Math.Round(p.AverageRuntime, 2),
            MasteryScore = Math.Round(p.MasteryScore, 4),
            IsWeakArea = p.IsWeakArea,
            LastAttemptedAt = p.LastAttemptedAt
        };
    }

    private async Task LogAsync(Guid studentId, RecommendationResponseDto response, CancellationToken ct)
    {
        try
        {
            double topCourseScore = response.Courses.FirstOrDefault()?.Score ?? 0;
            double topContestScore = response.Contests.FirstOrDefault()?.Score ?? 0;
            double topExerciseScore = response.Exercises.FirstOrDefault()?.Score ?? 0;
            double top = Math.Max(topCourseScore, Math.Max(topContestScore, topExerciseScore));

            string payload = JsonSerializer.Serialize(new
            {
                response.Courses,
                response.Contests,
                response.Exercises,
                response.WeakAreas,
                response.StrongAreas
            });

            RecommendationLog log = new(
                Guid.NewGuid(),
                studentId,
                "Mixed",
                response.Strategy,
                response.Courses.Count + response.Contests.Count + response.Exercises.Count,
                payload,
                top);

            await _writeDb.RecommendationLogs.AddAsync(log, ct);
            await _writeDb.SaveChangesAsync(ct);
        }
        catch
        {
            // Logging must never break the recommendation pipeline.
        }
    }
}
