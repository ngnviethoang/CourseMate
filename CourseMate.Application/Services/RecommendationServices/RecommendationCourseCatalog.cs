using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Services.RecommendationServices;

internal sealed class RecommendationCourseCatalog : IRecommendationCourseCatalog
{
    private readonly CourseMateReadOnlyDbContext _db;

    public RecommendationCourseCatalog(CourseMateReadOnlyDbContext db)
    {
        _db = db;
    }

    public async Task<List<CourseCatalogRow>> GetCandidatesAsync(CancellationToken ct)
    {
        // Join course + category + instructor + aggregate reviews and enrollments.
        // Materialized in memory to keep scoring fast.
        var query =
            from course in _db.Courses
            join category in _db.Categories on course.CategoryId equals category.Id
            join instructor in _db.Users on course.InstructorId equals instructor.Id
            where course.IsPublished
            select new
            {
                CourseId = course.Id,
                course.Title,
                course.Description,
                course.ImageUrl,
                course.Price,
                course.CategoryId,
                CategoryName = category.Name,
                InstructorId = course.InstructorId,
                InstructorName = instructor.UserName ?? string.Empty
            };

        var rowsAnonymous = await query.ToListAsync(ct);
        List<CourseCatalogRow> rows = rowsAnonymous.Select(x => new CourseCatalogRow(
            x.CourseId,
            x.Title,
            x.Description,
            x.ImageUrl,
            x.Price,
            x.CategoryId,
            x.CategoryName,
            x.InstructorId,
            x.InstructorName,
            0d,
            0)).ToList();
        if (rows.Count == 0)
        {
            return rows;
        }

        List<Guid> courseIds = rows.Select(r => r.CourseId).ToList();

        Dictionary<Guid, double> avgRatings = await _db.Reviews
            .Where(r => courseIds.Contains(r.CourseId))
            .GroupBy(r => r.CourseId)
            .Select(g => new { CourseId = g.Key, Avg = g.Average(x => x.Rating) })
            .ToDictionaryAsync(x => x.CourseId, x => (double)x.Avg, ct);

        Dictionary<Guid, int> enrollCounts = await _db.Enrollments
            .Where(e => courseIds.Contains(e.CourseId))
            .GroupBy(e => e.CourseId)
            .Select(g => new { CourseId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.CourseId, x => x.Count, ct);

        return rows.Select(r => r with
        {
            AverageRating = avgRatings.GetValueOrDefault(r.CourseId, 0),
            EnrollmentCount = enrollCounts.GetValueOrDefault(r.CourseId, 0)
        }).ToList();
    }
}
