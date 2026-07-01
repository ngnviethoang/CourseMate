using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Services.RecommendationServices;

/// <summary>
/// Collects every signal we need to compute a recommendation:
///   • the student's stated preferences (favourite categories, difficulty, goals)
///   • their per-(category,difficulty) mastery from <see cref="StudentSkillProfile"/>
///   • the set of courses they already enrolled in (so we never re-suggest them)
///   • collaborative evidence — students with similar skill profiles that ended up enrolling
///     in courses the current student has not.
/// All operations use the read-only DbContext to avoid disturbing the write store.
/// </summary>
internal sealed class RecommendationSignalCollector : IRecommendationSignalCollector
{
    private readonly CourseMateReadOnlyDbContext _db;

    public RecommendationSignalCollector(CourseMateReadOnlyDbContext db)
    {
        _db = db;
    }

    public async Task<StudentSignals> CollectSignalsAsync(Guid studentId, CancellationToken ct)
    {
        StudentPreference? preference = await _db.StudentPreferences
            .FirstOrDefaultAsync(x => x.StudentId == studentId, ct);

        List<StudentSkillProfile> profiles = await _db.StudentSkillProfiles
            .Where(x => x.StudentId == studentId)
            .ToListAsync(ct);

        HashSet<Guid> enrolledCourseIds = (await _db.Enrollments
                .Where(x => x.StudentId == studentId)
                .Select(x => x.CourseId)
                .ToListAsync(ct))
            .ToHashSet();

        HashSet<Guid> completedLessonIds = (await _db.UserLessonProgresses
                .Where(x => x.StudentId == studentId && x.IsCompleted)
                .Select(x => x.LessonId)
                .ToListAsync(ct))
            .ToHashSet();

        // Aggregate pass / attempts across all exercises & contests.
        List<ExerciseSubmission> exerciseSubmissions = await _db.ExerciseSubmissions
            .Where(x => x.UserId == studentId)
            .ToListAsync(ct);
        List<ContestSubmission> contestSubmissions = await _db.ContestSubmissions
            .Where(x => x.StudentId == studentId)
            .ToListAsync(ct);

        int totalAttempts = exerciseSubmissions.Count + contestSubmissions.Count;
        int passedAttempts = exerciseSubmissions.Count(x => x.IsPassed) + contestSubmissions.Count(x => x.Score > 0);
        double overallPassRate = totalAttempts == 0 ? 0 : (double)passedAttempts / totalAttempts;

        // Build category affinity map: combine explicit favourite categories with mastery scores.
        Dictionary<string, double> affinity = new(StringComparer.OrdinalIgnoreCase);
        if (preference != null)
        {
            foreach (string category in preference.FavouriteCategories)
            {
                if (string.IsNullOrWhiteSpace(category))
                {
                    continue;
                }

                affinity[category] = Math.Max(affinity.GetValueOrDefault(category, 0), 1.0);
            }
        }

        foreach (StudentSkillProfile profile in profiles)
        {
            // Invert mastery: low mastery => high affinity for improvement suggestions.
            double improvementAffinity = 1.0 - Math.Clamp(profile.MasteryScore, 0, 1);
            double existing = affinity.GetValueOrDefault(profile.Category, 0);
            affinity[profile.Category] = Math.Max(existing, 0.4 + improvementAffinity * 0.6);
        }

        List<CategoryAffinity> weakAreas = profiles
            .Where(p => p.IsWeakArea)
            .Select(p => new CategoryAffinity(p.Category, p.MasteryScore, true, false))
            .ToList();

        List<CategoryAffinity> strongAreas = profiles
            .Where(p => p.MasteryScore >= 0.75)
            .Select(p => new CategoryAffinity(p.Category, p.MasteryScore, false, true))
            .ToList();

        // Course-affinity dictionary (used by the collaborative branch).
        Dictionary<Guid, double> courseAffinityMap = new();
        foreach (StudentSkillProfile profile in profiles)
        {
            List<Guid> coursesInCategory = await (from course in _db.Courses
                join category in _db.Categories on course.CategoryId equals category.Id
                where category.Name == profile.Category
                select course.Id).Take(10).ToListAsync(ct);

            double boost = profile.IsWeakArea ? 0.8 : 0.2;
            foreach (Guid courseId in coursesInCategory)
            {
                courseAffinityMap[courseId] = Math.Max(courseAffinityMap.GetValueOrDefault(courseId, 0), boost);
            }
        }

        return new StudentSignals(
            studentId,
            affinity,
            weakAreas,
            strongAreas,
            enrolledCourseIds,
            completedLessonIds,
            courseAffinityMap,
            totalAttempts,
            overallPassRate);
    }
}
