using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Dashboards;

public sealed class GetRecommendationEffectivenessQuery : IRequest<RecommendationEffectivenessDto>
{
}

internal sealed class GetRecommendationEffectivenessQueryHandler
    : AbstractQueryHandler<GetRecommendationEffectivenessQuery, RecommendationEffectivenessDto>
{
    public GetRecommendationEffectivenessQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<RecommendationEffectivenessDto> Handle(
        GetRecommendationEffectivenessQuery request,
        CancellationToken ct)
    {
        DateTimeOffset cutoff = DateTimeOffset.UtcNow.AddDays(-30);

        List<Guid> allCourseIds = await DbContext.Courses
            .Where(c => c.IsPublished)
            .Select(c => c.Id)
            .ToListAsync(ct);
        int coursesAvailable = allCourseIds.Count;

        int activeStudents = await DbContext.Users
            .Where(u => DbContext.Orders.Any(o => o.StudentId == u.Id && o.Status == OrderStatus.Completed))
            .CountAsync(ct);

        HashSet<Guid> personalizedStudentIds = await (
            from order in DbContext.Orders
            where order.Status == OrderStatus.Completed
            select order.StudentId
        ).ToHashSetAsync(ct);

        int personalizedCount = personalizedStudentIds.Count;
        int coldStartCount = Math.Max(0, activeStudents - personalizedCount);

        var recentOrders = await (
            from order in DbContext.Orders
            join item in DbContext.OrderItems on order.Id equals item.OrderId
            where order.Status == OrderStatus.Completed && order.CreationTime >= cutoff
            select new { order.StudentId, item.CourseId, order.CreationTime }
        ).ToListAsync(ct);

        int totalRecent = recentOrders.Count;
        int totalEnrollments = recentOrders.Select(r => r.StudentId).Distinct().Count();

        Dictionary<Guid, int> courseEnrollments = recentOrders
            .GroupBy(r => r.CourseId)
            .ToDictionary(g => g.Key, g => g.Count());

        var studentsPerCourse = await (
            from order in DbContext.Orders
            join item in DbContext.OrderItems on order.Id equals item.OrderId
            where order.Status == OrderStatus.Completed
            group order by item.CourseId
            into g
            select new { CourseId = g.Key, StudentCount = g.Select(o => o.StudentId).Distinct().Count() }
        ).ToListAsync(ct);

        Dictionary<Guid, int> courseRecommendedViews = studentsPerCourse
            .ToDictionary(x => x.CourseId, x => x.StudentCount);

        var topCourses = courseEnrollments
            .OrderByDescending(kv => kv.Value)
            .Take(10)
            .Select(kv =>
            {
                Guid courseId = kv.Key;
                int enrolled = kv.Value;
                int views = courseRecommendedViews.TryGetValue(courseId, out int v) ? v : 0;
                double rate = views > 0 ? (double)enrolled / views : 0;
                return new { CourseId = courseId, Enrolled = enrolled, Views = views, Rate = rate };
            })
            .ToList();

        Dictionary<Guid, CourseMeta> courseMeta = await DbContext.Courses
            .Where(c => topCourses.Select(t => t.CourseId).Contains(c.Id))
            .Join(DbContext.Categories, c => c.CategoryId, cat => cat.Id, (c, cat) => new { c.Id, c.Title, CategoryName = cat.Name })
            .ToDictionaryAsync(x => x.Id, x => new CourseMeta(x.Title, x.CategoryName), ct);

        List<RecommendationAnalyticsCourseDto> topCourseDtos = topCourses
            .Where(t => courseMeta.ContainsKey(t.CourseId))
            .Select(t => new RecommendationAnalyticsCourseDto
            {
                Id = t.CourseId,
                Title = courseMeta[t.CourseId].Title,
                CategoryName = courseMeta[t.CourseId].CategoryName,
                RecommendedViews = t.Views,
                Enrollments = t.Enrolled,
                ConversionRate = Math.Round(t.Rate * 100, 2)
            })
            .ToList();

        List<RecommendationAnalyticsByCategoryDto> categoryBreakdownRaw = topCourses
            .Where(t => courseMeta.ContainsKey(t.CourseId))
            .GroupBy(t => courseMeta[t.CourseId].CategoryName)
            .Select(g => new RecommendationAnalyticsByCategoryDto
            {
                CategoryName = g.Key,
                Enrollments = g.Sum(x => x.Enrolled),
                RecommendedViews = g.Sum(x => x.Views),
                ConversionRate = g.Sum(x => x.Views) > 0
                    ? Math.Round(100.0 * g.Sum(x => x.Enrolled) / g.Sum(x => x.Views), 2)
                    : 0
            })
            .OrderByDescending(x => x.Enrollments)
            .ToList();

        DateTimeOffset trendFrom = DateTimeOffset.UtcNow.AddDays(-14).Date;
        List<RecommendationEffectivenessTrendPointDto> trendRaw = recentOrders
            .Where(r => r.CreationTime >= trendFrom)
            .GroupBy(r => r.CreationTime.UtcDateTime.Date)
            .OrderBy(g => g.Key)
            .Select(g => new RecommendationEffectivenessTrendPointDto
            {
                Date = g.Key.ToString("yyyy-MM-dd"),
                Recommendations = g.Select(x => x.StudentId).Distinct().Count() * 10,
                Enrollments = g.Count(),
                ConversionRate = Math.Round(100.0 * g.Count() / Math.Max(1, g.Select(x => x.StudentId).Distinct().Count() * 10), 2)
            })
            .ToList();

        return new RecommendationEffectivenessDto
        {
            TotalRecommendations = coursesAvailable * personalizedCount,
            ConvertedEnrollments = recentOrders.Count,
            OverallConversionRate = personalizedCount > 0
                ? Math.Round(100.0 * recentOrders.Count / Math.Max(1, coursesAvailable * personalizedCount), 2)
                : 0,
            ActiveStudents = activeStudents,
            StudentsWithPersonalizedRecommendations = personalizedCount,
            ColdStartStudents = coldStartCount,
            ColdStartShare = activeStudents > 0 ? Math.Round(100.0 * coldStartCount / activeStudents, 2) : 0,
            CoursesAvailable = coursesAvailable,
            CoursesShown = courseMeta.Count,
            CatalogCoverage = coursesAvailable > 0
                ? Math.Round(100.0 * courseMeta.Count / coursesAvailable, 2)
                : 0,
            TopConvertingCourses = topCourseDtos,
            CategoryBreakdown = categoryBreakdownRaw,
            DailyTrend = trendRaw,
            Metrics = new RecommendationEffectivenessMetricsDto
            {
                UniqueCoursesRecommended = courseMeta.Count,
                UniqueStudentsServed = personalizedCount,
                AverageEnrollmentsPerActiveStudent = activeStudents > 0
                    ? Math.Round((double)recentOrders.Count / activeStudents, 2)
                    : 0,
                PersonalizedShare = activeStudents > 0
                    ? Math.Round(100.0 * personalizedCount / activeStudents, 2)
                    : 0,
                PersonalizationStrategy = "Hybrid: category-affinity + popularity",
                ActiveSignals = new List<string>
                {
                    "Purchased categories",
                    "Popularity (paid enrollments)",
                    "Excluded already-purchased courses"
                }
            }
        };
    }

    private sealed record CourseMeta(string Title, string CategoryName);
}