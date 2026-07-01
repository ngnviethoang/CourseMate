using System.Security.Cryptography;
using System.Text;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Services.RecommendationServices;

/// <summary>
/// Hybrid scorer: combines content-based, collaborative, weakness-driven and popularity
/// signals to produce a final ranking for courses, contests and exercises.
/// All weights are configurable through <see cref="RecommendationOptions"/>.
/// </summary>
internal sealed class RecommendationScorer : IRecommendationScorer
{
    private readonly RecommendationOptions _options;
    private readonly IRecommendationCourseCatalog _catalog;
    private readonly CourseMateReadOnlyDbContext _db;

    public RecommendationScorer(
        RecommendationOptions options,
        IRecommendationCourseCatalog catalog,
        CourseMateReadOnlyDbContext db)
    {
        _options = options;
        _catalog = catalog;
        _db = db;
    }

    public async Task<List<ScoredCourse>> ScoreCoursesAsync(StudentSignals signals, int topN, CancellationToken ct)
    {
        List<CourseCatalogRow> catalog = await _catalog.GetCandidatesAsync(ct);

        if (catalog.Count == 0)
        {
            return new List<ScoredCourse>();
        }

        // Pre-compute collaborative candidates: peer students (similar skill profile) that enrolled
        // in courses the current student has not.
        Dictionary<Guid, double> collaborativeBoost = await ComputeCollaborativeBoostAsync(signals, ct);

        List<ScoredCourse> scored = new();
        foreach (CourseCatalogRow row in catalog)
        {
            if (signals.EnrolledCourseIds.Contains(row.CourseId))
            {
                continue; // never re-recommend a course the student already owns
            }

            double contentScore = ScoreContent(row, signals);
            double collaborativeScore = collaborativeBoost.GetValueOrDefault(row.CourseId, 0);
            double weaknessScore = signals.CourseAffinityMap.GetValueOrDefault(row.CourseId, 0);
            double popularityScore = ScorePopularity(row);

            double finalScore =
                contentScore * _options.ContentWeight +
                collaborativeScore * _options.CollaborativeWeight +
                weaknessScore * _options.WeaknessWeight +
                popularityScore * _options.PopularityWeight;

            List<string> reasons = BuildReasons(contentScore, collaborativeScore, weaknessScore, popularityScore);
            string explanation = BuildExplanation(row, reasons);

            scored.Add(new ScoredCourse(
                row.CourseId,
                contentScore,
                collaborativeScore,
                weaknessScore,
                popularityScore,
                finalScore,
                reasons,
                explanation));
        }

        return scored
            .OrderByDescending(x => x.FinalScore)
            .ThenByDescending(x => x.CollaborativeScore)
            .Take(topN)
            .ToList();
    }

    public async Task<List<ScoredContest>> ScoreContestsAsync(StudentSignals signals, int topN, CancellationToken ct)
    {
        IQueryable<ContestQueryRow> contestsQuery =
            from c in _db.Contests
            join u in _db.Users on c.CreatorId equals u.Id
            where c.Status != ContestStatus.Draft && c.Status != ContestStatus.Cancelled
            select new ContestQueryRow
            {
                ContestId = c.Id,
                Title = c.Title,
                Description = c.Description,
                Status = c.Status,
                StartTime = c.StartTime,
                EndTime = c.EndTime,
                DurationInMinutes = c.DurationInMinutes,
                CreatorName = u.UserName ?? string.Empty
            };
        List<ContestQueryRow> contestsList = await contestsQuery.ToListAsync(ct);
        List<ContestCandidateRow> contests = contestsList.Select(x => new ContestCandidateRow(
            x.ContestId,
            x.Title,
            x.Description,
            x.Status,
            x.StartTime,
            x.EndTime,
            x.DurationInMinutes,
            x.CreatorName,
            0,
            0,
            false)).ToList();

        if (contests.Count == 0)
        {
            return new List<ScoredContest>();
        }

        List<Guid> contestIds = contests.Select(c => c.ContestId).ToList();

        var exerciseCountsQuery =
            from ce in _db.ContestExercises
            where contestIds.Contains(ce.ContestId)
            group ce by ce.ContestId
            into g
            select new ContestGroupCount { ContestId = g.Key, Count = g.Count() };
        List<ContestGroupCount> exerciseCounts = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(exerciseCountsQuery, ct);
        Dictionary<Guid, int> exerciseCountDict = exerciseCounts.ToDictionary(x => x.ContestId, x => x.Count);

        var participantsQuery =
            from r in _db.ContestRegistrations
            where contestIds.Contains(r.ContestId)
            group r by r.ContestId
            into g
            select new ContestGroupCount { ContestId = g.Key, Count = g.Count() };
        List<ContestGroupCount> participants = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(participantsQuery, ct);
        Dictionary<Guid, int> participantDict = participants.ToDictionary(x => x.ContestId, x => x.Count);

        List<Guid> alreadyRegisteredIds = await _db.ContestRegistrations
                .Where(r => r.StudentId == signals.StudentId && contestIds.Contains(r.ContestId))
                .Select(r => r.ContestId)
                .ToListAsync(ct);
        HashSet<Guid> alreadyRegistered = alreadyRegisteredIds.ToHashSet();

        List<ScoredContest> result = new();
        foreach (ContestCandidateRow row in contests)
        {
            if (alreadyRegistered.Contains(row.ContestId))
            {
                continue;
            }

            int exerciseCount = exerciseCountDict.GetValueOrDefault(row.ContestId, 0);
            int participantCount = participantDict.GetValueOrDefault(row.ContestId, 0);

            double categoryMatch = ScoreContestCategoryMatch(row, signals);
            double statusBoost = row.Status switch
            {
                ContestStatus.Ongoing => 1.0,
                ContestStatus.Upcoming => 0.8,
                ContestStatus.Ended => 0.1,
                _ => 0.2
            };
            double participationBoost = Math.Min(participantCount / 100d, 1.0);
            double difficultyMatch = ScoreDifficultyMatchForContest(row, signals);

            double finalScore = categoryMatch * 0.5 + statusBoost * 0.2 + participationBoost * 0.1 + difficultyMatch * 0.2;

            List<string> reasons = new();
            if (categoryMatch > 0.5)
            {
                reasons.Add(RecommendationReason.FavouriteCategory.ToString());
            }
            if (signals.WeakAreas.Any())
            {
                reasons.Add(RecommendationReason.WeakAreaImprovement.ToString());
            }
            if (row.Status == ContestStatus.Upcoming || row.Status == ContestStatus.Ongoing)
            {
                reasons.Add(RecommendationReason.UpcomingContest.ToString());
            }
            if (reasons.Count == 0)
            {
                reasons.Add(RecommendationReason.PopularInCategory.ToString());
            }

            string explanation =
                $"Trận đấu {row.Title} phù hợp vì: {string.Join(", ", reasons.Select(TranslateReason))}.";

            result.Add(new ScoredContest(row.ContestId, finalScore, reasons, explanation));
        }

        return result
            .OrderByDescending(x => x.Score)
            .Take(topN)
            .ToList();
    }

    public async Task<List<ScoredExercise>> ScoreExercisesAsync(StudentSignals signals, int topN, CancellationToken ct)
    {
        IQueryable<ExerciseQueryRow> exercisesQuery =
            from e in _db.Exercises
            join u in _db.Users on e.CreatorId equals u.Id
            where !e.IsHidden
            select new ExerciseQueryRow
            {
                ExerciseId = e.Id,
                Title = e.Title,
                Description = e.Description,
                Category = e.Category,
                Difficulty = e.Difficulty,
                CreatedByName = u.UserName ?? string.Empty
            };
        List<ExerciseQueryRow> exercisesList = await exercisesQuery.ToListAsync(ct);
        List<ExerciseCandidateRow> exercises = exercisesList.Select(x => new ExerciseCandidateRow(
            x.ExerciseId,
            x.Title,
            x.Description,
            x.Category,
            x.Difficulty,
            x.CreatedByName,
            0)).ToList();

        if (exercises.Count == 0)
        {
            return new List<ScoredExercise>();
        }

        List<Guid> exerciseIds = exercises.Select(x => x.ExerciseId).ToList();

        var testCasesQuery =
            from tc in _db.ExerciseTestCases
            where exerciseIds.Contains(tc.ExerciseId)
            group tc by tc.ExerciseId
            into g
            select new ContestGroupCount { ContestId = g.Key, Count = g.Count() };
        List<ContestGroupCount> testCasesGroup = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(testCasesQuery, ct);
        Dictionary<Guid, int> testCaseCountDict = testCasesGroup.ToDictionary(x => x.ContestId, x => x.Count);

        List<Guid> attemptedIds = await _db.ExerciseSubmissions
                .Where(s => s.UserId == signals.StudentId && exerciseIds.Contains(s.ExerciseId))
                .Select(s => s.ExerciseId)
                .Distinct()
                .ToListAsync(ct);
        HashSet<Guid> alreadyAttempted = attemptedIds.ToHashSet();

        List<ScoredExercise> result = new();
        foreach (ExerciseCandidateRow row in exercises)
        {
            if (alreadyAttempted.Contains(row.ExerciseId) && signals.WeakAreas.All(w => !w.Category.Equals(row.Category, StringComparison.OrdinalIgnoreCase)))
            {
                // Skip exercises the student already solved unless it targets a weak area.
                continue;
            }

            int testCaseCount = testCaseCountDict.GetValueOrDefault(row.ExerciseId, 0);
            double categoryAffinity = signals.CategoryAffinityMap.GetValueOrDefault(row.Category, 0);
            double difficultyScore = signals.WeakAreas.Any(w => w.Category.Equals(row.Category, StringComparison.OrdinalIgnoreCase))
                ? 1.0 - (int)row.Difficulty / 2d // easier exercise recommended when weak
                : 0.5;

            double finalScore = categoryAffinity * 0.7 + difficultyScore * 0.3;

            List<string> reasons = new();
            if (categoryAffinity > 0.5)
            {
                reasons.Add(RecommendationReason.WeakAreaImprovement.ToString());
            }
            if (alreadyAttempted.Contains(row.ExerciseId))
            {
                reasons.Add(RecommendationReason.FreePractice.ToString());
            }
            if (reasons.Count == 0)
            {
                reasons.Add(RecommendationReason.PopularInCategory.ToString());
            }

            string explanation =
                $"Bài tập {row.Title} ({row.Difficulty}) được đề xuất vì: {string.Join(", ", reasons.Select(TranslateReason))}.";

            result.Add(new ScoredExercise(row.ExerciseId, finalScore, reasons, explanation));
        }

        return result
            .OrderByDescending(x => x.Score)
            .Take(topN)
            .ToList();
    }

    private async Task<Dictionary<Guid, double>> ComputeCollaborativeBoostAsync(StudentSignals signals, CancellationToken ct)
    {
        if (signals.TotalAttempts == 0)
        {
            return new Dictionary<Guid, double>();
        }

        // Find peer students with similar pass rate (within ±0.15) who enrolled in courses
        // the current student has not.
        double lowerBound = Math.Max(0, signals.OverallPassRate - 0.15);
        double upperBound = Math.Min(1, signals.OverallPassRate + 0.15);

        List<Guid> peerIds = await _db.StudentSkillProfiles
            .Where(p => p.StudentId != signals.StudentId && p.MasteryScore >= lowerBound && p.MasteryScore <= upperBound)
            .Select(p => p.StudentId)
            .Distinct()
            .Take(200)
            .ToListAsync(ct);

        if (peerIds.Count == 0)
        {
            return new Dictionary<Guid, double>();
        }

        List<Guid> peerCourseIds = await _db.Enrollments
            .Where(e => peerIds.Contains(e.StudentId))
            .Select(e => e.CourseId)
            .ToListAsync(ct);

        return peerCourseIds
            .GroupBy(id => id)
            .Where(g => !signals.EnrolledCourseIds.Contains(g.Key))
            .ToDictionary(g => g.Key, g => Math.Min(1.0, g.Count() / 10d));
    }

    private static double ScoreContent(CourseCatalogRow row, StudentSignals signals)
    {
        double categoryAffinity = signals.CategoryAffinityMap.GetValueOrDefault(row.CategoryName, 0);
        // Token-based similarity between course description and learning goal would be ideal,
        // but a stable proxy is the title/description keyword overlap with category names.
        return Math.Clamp(categoryAffinity, 0, 1);
    }

    private static double ScorePopularity(CourseCatalogRow row)
    {
        double ratingComponent = row.AverageRating / 5d;
        double enrollmentComponent = Math.Min(row.EnrollmentCount / 200d, 1.0);
        return ratingComponent * 0.5 + enrollmentComponent * 0.5;
    }

    private static double ScoreContestCategoryMatch(ContestCandidateRow row, StudentSignals signals)
    {
        // Contest does not have a category; we approximate with creator's courses.
        // For now, rely on whether the contest's exercises (not loaded here) match weak areas.
        // If we have weak areas the student should be more motivated to participate.
        if (signals.WeakAreas.Any())
        {
            return 0.7;
        }

        return signals.StrongAreas.Any() ? 0.4 : 0.3;
    }

    private static double ScoreDifficultyMatchForContest(ContestCandidateRow row, StudentSignals signals)
    {
        // A simple heuristic: weak students prefer contests with relaxed time limits.
        // We assume duration > 60 minutes matches a beginner.
        return signals.WeakAreas.Any() && row.DurationInMinutes >= 60 ? 1.0 : 0.5;
    }

    private static List<string> BuildReasons(double contentScore, double collaborativeScore, double weaknessScore, double popularityScore)
    {
        List<string> reasons = new();
        if (contentScore > 0.5)
        {
            reasons.Add(RecommendationReason.FavouriteCategory.ToString());
        }
        if (weaknessScore > 0.5)
        {
            reasons.Add(RecommendationReason.WeakAreaImprovement.ToString());
        }
        if (collaborativeScore > 0.4)
        {
            reasons.Add(RecommendationReason.CollaborativeSimilarStudents.ToString());
        }
        if (popularityScore > 0.7)
        {
            reasons.Add(RecommendationReason.PopularInCategory.ToString());
        }
        if (reasons.Count == 0)
        {
            reasons.Add(RecommendationReason.None.ToString());
        }

        return reasons;
    }

    private static string BuildExplanation(CourseCatalogRow row, List<string> reasons)
    {
        if (reasons.Contains(RecommendationReason.WeakAreaImprovement.ToString()))
        {
            return $"Khóa học \"{row.Title}\" giúp cải thiện điểm yếu của bạn trong lĩnh vực {row.CategoryName}.";
        }

        if (reasons.Contains(RecommendationReason.CollaborativeSimilarStudents.ToString()))
        {
            return $"Các học viên có trình độ tương đương đã đăng ký \"{row.Title}\" ({row.CategoryName}).";
        }

        return $"Khóa học \"{row.Title}\" phù hợp với sở thích của bạn trong lĩnh vực {row.CategoryName}.";
    }

    private static string TranslateReason(string reason)
    {
        return reason switch
        {
            nameof(RecommendationReason.FavouriteCategory) => "khớp với danh mục yêu thích",
            nameof(RecommendationReason.PreferredDifficulty) => "khớp với độ khó mong muốn",
            nameof(RecommendationReason.WeakAreaImprovement) => "cải thiện điểm yếu",
            nameof(RecommendationReason.SimilarToEnrolledCourse) => "tương tự khóa học đã đăng ký",
            nameof(RecommendationReason.PopularInCategory) => "phổ biến trong danh mục",
            nameof(RecommendationReason.InstructorMatch) => "giảng viên phù hợp",
            nameof(RecommendationReason.CollaborativeSimilarStudents) => "được yêu thích bởi học viên tương đồng",
            nameof(RecommendationReason.UpcomingContest) => "cuộc thi đang/sắp diễn ra",
            nameof(RecommendationReason.FreePractice) => "luyện tập tự do",
            _ => "gợi ý chung"
        };
    }

    private sealed record ContestCandidateRow(
        Guid ContestId,
        string Title,
        string Description,
        ContestStatus Status,
        DateTimeOffset? StartTime,
        DateTimeOffset? EndTime,
        int DurationInMinutes,
        string CreatorName,
        int ExerciseCount,
        int ParticipantCount,
        bool IsRegistered);

    private sealed record ExerciseCandidateRow(
        Guid ExerciseId,
        string Title,
        string Description,
        string Category,
        ExerciseDifficultyType Difficulty,
        string CreatedByName,
        int TestCaseCount);

    private sealed class ContestGroupCount
    {
        public Guid ContestId { get; set; }
        public int Count { get; set; }
    }

    private sealed class ContestQueryRow
    {
        public Guid ContestId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ContestStatus Status { get; set; }
        public DateTimeOffset? StartTime { get; set; }
        public DateTimeOffset? EndTime { get; set; }
        public int DurationInMinutes { get; set; }
        public string CreatorName { get; set; } = string.Empty;
    }

    private sealed class ExerciseQueryRow
    {
        public Guid ExerciseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public ExerciseDifficultyType Difficulty { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
    }
}
