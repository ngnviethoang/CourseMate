using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Services.RecommendationServices;

public interface IRecommendationAnalyticsService
{
    Task LogRecommendationAsync(
        Guid studentId,
        Guid courseId,
        double contentScore,
        double collaborativeScore,
        double weaknessScore,
        double popularityScore,
        double finalScore,
        RecommendationSource source);

    Task RecordFeedbackAsync(Guid analyticsId, RecommendationFeedback feedback);
    Task<RecommendationAnalyticsSummaryDto> GetSummaryAsync(DateTimeOffset? from = null, DateTimeOffset? to = null);
    Task<List<RecommendationAnalyticsDto>> GetByStudentAsync(Guid studentId);
    Task<StudentRecommendationStatsDto> GetStudentStatsAsync(Guid studentId);
    Task<List<CoursePerformanceDto>> GetTopPerformingCoursesAsync(int top = 10);
    Task MarkAsEnrolledAsync(Guid analyticsId, Guid enrollmentId);
    Task MarkAsCompletedAsync(Guid analyticsId);
}

public class RecommendationAnalyticsService : IRecommendationAnalyticsService
{
    private readonly CourseMateDbContext _context;

    public RecommendationAnalyticsService(CourseMateDbContext context)
    {
        _context = context;
    }

    public async Task LogRecommendationAsync(
        Guid studentId,
        Guid courseId,
        double contentScore,
        double collaborativeScore,
        double weaknessScore,
        double popularityScore,
        double finalScore,
        RecommendationSource source)
    {
        var analytics = new RecommendationAnalytics(
            Guid.NewGuid(),
            studentId,
            courseId,
            null,
            contentScore,
            collaborativeScore,
            weaknessScore,
            popularityScore,
            finalScore,
            source.ToString(),
            RecommendationFeedback.Shown.ToString(),
            DateTimeOffset.UtcNow);

        _context.RecommendationAnalytics.Add(analytics);
        await _context.SaveChangesAsync();
    }

    public async Task RecordFeedbackAsync(Guid analyticsId, RecommendationFeedback feedback)
    {
        var analytics = await _context.RecommendationAnalytics.FindAsync(analyticsId);
        if (analytics == null) return;

        analytics.Feedback = feedback.ToString();
        analytics.FeedbackTime = DateTimeOffset.UtcNow;

        if (feedback == RecommendationFeedback.Enrolled)
        {
            analytics.EnrolledAt = DateTimeOffset.UtcNow;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<RecommendationAnalyticsSummaryDto> GetSummaryAsync(DateTimeOffset? from = null, DateTimeOffset? to = null)
    {
        var query = _context.RecommendationAnalytics.AsQueryable();

        if (from.HasValue)
            query = query.Where(x => x.CreationTime >= from.Value);
        if (to.HasValue)
            query = query.Where(x => x.CreationTime <= to.Value);

        var all = await query.ToListAsync();
        var total = all.Count;
        if (total == 0)
            return CreateEmptySummary();

        var enrollments = all.Count(x => x.EnrollmentId != null);
        var feedbacks = all.Where(x => x.Feedback != RecommendationFeedback.Shown.ToString()).ToList();
        var helpful = feedbacks.Count(x => x.Feedback == RecommendationFeedback.Helpful.ToString());
        var notHelpful = feedbacks.Count(x => x.Feedback == RecommendationFeedback.NotHelpful.ToString());

        var recommendationsBySource = all
            .GroupBy(x => x.Source)
            .ToDictionary(g => g.Key, g => g.Count());

        var averageScoresBySource = all
            .GroupBy(x => x.Source)
            .ToDictionary(
                g => g.Key,
                g => g.Average(x => x.FinalScore));

        var topCourses = await GetTopPerformingCoursesInternalAsync(10);
        var worstCourses = await GetWorstPerformingCoursesInternalAsync(10);

        return new RecommendationAnalyticsSummaryDto(
            TotalRecommendations: total,
            TotalEnrollments: enrollments,
            TotalFeedbacks: feedbacks.Count,
            HelpfulFeedbacks: helpful,
            NotHelpfulFeedbacks: notHelpful,
            ClickThroughRate: total > 0 ? (double)(total - all.Count(x => x.Feedback == RecommendationFeedback.Shown.ToString() && x.EnrollmentId == null)) / total : 0,
            EnrollmentRate: total > 0 ? (double)enrollments / total : 0,
            HelpfulRate: feedbacks.Count > 0 ? (double)helpful / feedbacks.Count : 0,
            RecommendationsBySource: recommendationsBySource,
            AverageScoresBySource: averageScoresBySource,
            TopPerformingCourses: topCourses,
            WorstPerformingCourses: worstCourses,
            AverageScoresByCategory: new Dictionary<string, double>());
    }

    public async Task<List<RecommendationAnalyticsDto>> GetByStudentAsync(Guid studentId)
    {
        return await _context.RecommendationAnalytics
            .Where(x => x.StudentId == studentId)
            .OrderByDescending(x => x.CreationTime)
            .Select(x => new RecommendationAnalyticsDto(
                x.Id,
                x.StudentId,
                x.CourseId,
                x.EnrollmentId,
                x.ContentScore,
                x.CollaborativeScore,
                x.WeaknessScore,
                x.PopularityScore,
                x.FinalScore,
                x.Source,
                x.Feedback,
                x.FeedbackTime,
                x.EnrolledAt,
                x.IsCompleted,
                x.CompletedAt,
                x.CreationTime))
            .ToListAsync();
    }

    public async Task<StudentRecommendationStatsDto> GetStudentStatsAsync(Guid studentId)
    {
        var all = await _context.RecommendationAnalytics
            .Where(x => x.StudentId == studentId)
            .ToListAsync();

        if (all.Count == 0)
            return new StudentRecommendationStatsDto(
                studentId, 0, 0, 0, 0, 0, new List<string>());

        var enrollments = all.Count(x => x.EnrollmentId != null);
        var completed = all.Count(x => x.IsCompleted);

        return new StudentRecommendationStatsDto(
            studentId,
            all.Count,
            enrollments,
            completed,
            all.Count > 0 ? (double)enrollments / all.Count : 0,
            enrollments > 0 ? (double)completed / enrollments : 0,
            all.GroupBy(x => x.Source)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .ToList());
    }

    public async Task<List<CoursePerformanceDto>> GetTopPerformingCoursesAsync(int top = 10)
    {
        return await GetTopPerformingCoursesInternalAsync(top);
    }

    public async Task MarkAsEnrolledAsync(Guid analyticsId, Guid enrollmentId)
    {
        var analytics = await _context.RecommendationAnalytics.FindAsync(analyticsId);
        if (analytics == null) return;

        analytics.EnrollmentId = enrollmentId;
        analytics.EnrolledAt = DateTimeOffset.UtcNow;
        analytics.Feedback = RecommendationFeedback.Enrolled.ToString();
        analytics.FeedbackTime = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task MarkAsCompletedAsync(Guid analyticsId)
    {
        var analytics = await _context.RecommendationAnalytics.FindAsync(analyticsId);
        if (analytics == null) return;

        analytics.IsCompleted = true;
        analytics.CompletedAt = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();
    }

    private async Task<List<CoursePerformanceDto>> GetTopPerformingCoursesInternalAsync(int top)
    {
        var courseIds = await _context.RecommendationAnalytics
            .Select(x => x.CourseId)
            .Distinct()
            .ToListAsync();

        var courses = await _context.Courses
            .Where(c => courseIds.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id, c => c);

        var stats = await _context.RecommendationAnalytics
            .GroupBy(x => x.CourseId)
            .Select(g => new
            {
                CourseId = g.Key,
                RecommendationCount = g.Count(),
                EnrollmentCount = g.Count(x => x.EnrollmentId != null),
                CompletionCount = g.Count(x => x.IsCompleted),
                AverageFeedbackScore = g.Where(x => x.Feedback != null && x.Feedback != RecommendationFeedback.Shown.ToString())
                    .Select(x => x.Feedback == RecommendationFeedback.Helpful.ToString() ? 1.0 : 0.0)
                    .DefaultIfEmpty(0.5)
                    .Average()
            })
            .OrderByDescending(x => x.EnrollmentCount)
            .Take(top)
            .ToListAsync();

        return stats.Select(s => new CoursePerformanceDto(
            s.CourseId,
            courses.GetValueOrDefault(s.CourseId)?.Title ?? "Unknown",
            s.RecommendationCount,
            s.EnrollmentCount,
            s.CompletionCount,
            s.RecommendationCount > 0 ? (double)s.EnrollmentCount / s.RecommendationCount : 0,
            s.EnrollmentCount > 0 ? (double)s.CompletionCount / s.EnrollmentCount : 0,
            s.AverageFeedbackScore)).ToList();
    }

    private async Task<List<CoursePerformanceDto>> GetWorstPerformingCoursesInternalAsync(int top)
    {
        var courseIds = await _context.RecommendationAnalytics
            .Select(x => x.CourseId)
            .Distinct()
            .ToListAsync();

        var courses = await _context.Courses
            .Where(c => courseIds.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id, c => c);

        var stats = await _context.RecommendationAnalytics
            .GroupBy(x => x.CourseId)
            .Select(g => new
            {
                CourseId = g.Key,
                RecommendationCount = g.Count(),
                EnrollmentCount = g.Count(x => x.EnrollmentId != null),
                CompletionCount = g.Count(x => x.IsCompleted),
                AverageFeedbackScore = g.Where(x => x.Feedback != null && x.Feedback != RecommendationFeedback.Shown.ToString())
                    .Select(x => x.Feedback == RecommendationFeedback.Helpful.ToString() ? 1.0 : 0.0)
                    .DefaultIfEmpty(0.5)
                    .Average()
            })
            .OrderBy(x => x.EnrollmentCount)
            .Take(top)
            .ToListAsync();

        return stats.Select(s => new CoursePerformanceDto(
            s.CourseId,
            courses.GetValueOrDefault(s.CourseId)?.Title ?? "Unknown",
            s.RecommendationCount,
            s.EnrollmentCount,
            s.CompletionCount,
            s.RecommendationCount > 0 ? (double)s.EnrollmentCount / s.RecommendationCount : 0,
            s.EnrollmentCount > 0 ? (double)s.CompletionCount / s.EnrollmentCount : 0,
            s.AverageFeedbackScore)).ToList();
    }

    private RecommendationAnalyticsSummaryDto CreateEmptySummary()
    {
        return new RecommendationAnalyticsSummaryDto(
            0, 0, 0, 0, 0, 0, 0, 0,
            new Dictionary<string, int>(),
            new Dictionary<string, double>(),
            new List<CoursePerformanceDto>(),
            new List<CoursePerformanceDto>(),
            new Dictionary<string, double>());
    }
}
