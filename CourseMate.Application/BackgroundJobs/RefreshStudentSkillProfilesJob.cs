using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CourseMate.Application.BackgroundJobs;

public class RefreshStudentSkillProfilesJob
{
    private const int WeakAreaMinAttempts = 3;
    private const double WeakAreaMasteryThreshold = 0.5;

    private readonly CourseMateDbContext _db;
    private readonly ILogger<RefreshStudentSkillProfilesJob> _logger;

    public RefreshStudentSkillProfilesJob(CourseMateDbContext db, ILogger<RefreshStudentSkillProfilesJob> logger)
    {
        _db = db;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 2)]
    public async Task ExecuteAsync(CancellationToken ct)
    {
        _logger.LogInformation("Starting refresh of StudentSkillProfiles");

        var submissions = await (
            from s in _db.ExerciseSubmissions
            join e in _db.Exercises on s.ExerciseId equals e.Id
            where !s.IsDeleted && !e.IsDeleted && s.UserId != null
            select new
            {
                StudentId = s.UserId!.Value,
                s.ExerciseId,
                e.Category,
                Difficulty = (int)e.Difficulty,
                s.IsPassed,
                s.Score,
                s.TotalTime,
                s.CreationTime
            }
        ).AsNoTracking().ToListAsync(ct);

        var studentIds = submissions.Select(s => s.StudentId).Distinct().ToList();
        if (studentIds.Count == 0)
        {
            _logger.LogInformation("No submissions found, skipping skill profile refresh");
            return;
        }

        var existingProfiles = await _db.StudentSkillProfiles
            .Where(p => studentIds.Contains(p.StudentId))
            .ToListAsync(ct);

        var byKey = existingProfiles.ToDictionary(p => (p.StudentId, p.Category.Trim().ToLowerInvariant(), p.Difficulty));

        var grouped = submissions
            .GroupBy(x => new { x.StudentId, Category = x.Category.Trim(), x.Difficulty });

        var newProfiles = new List<StudentSkillProfile>();
        var updatedProfiles = new List<StudentSkillProfile>();

        foreach (var group in grouped)
        {
            if (string.IsNullOrEmpty(group.Key.Category))
            {
                continue;
            }

            var items = group.ToList();
            int total = items.Count;
            int passed = items.Count(i => i.IsPassed);
            double passRate = total == 0 ? 0 : (double)passed / total;
            double avgScore = total == 0 ? 0 : items.Average(i => i.Score);
            double avgRuntime = total == 0 ? 0 : items.Average(i => i.TotalTime);
            double mastery = (passRate * 0.7) + ((avgScore / 100.0) * 0.3);
            bool isWeak = total >= WeakAreaMinAttempts && mastery < WeakAreaMasteryThreshold;
            DateTimeOffset lastAttempted = items.Max(i => i.CreationTime);

            var key = (group.Key.StudentId, group.Key.Category.ToLowerInvariant(), group.Key.Difficulty);
            if (byKey.TryGetValue(key, out var existing))
            {
                existing.TotalAttempts = total;
                existing.PassedAttempts = passed;
                existing.AverageScore = avgScore;
                existing.AverageRuntime = avgRuntime;
                existing.MasteryScore = mastery;
                existing.IsWeakArea = isWeak;
                existing.LastAttemptedAt = lastAttempted;
                updatedProfiles.Add(existing);
            }
            else
            {
                var profile = new StudentSkillProfile(
                    id: Guid.NewGuid(),
                    studentId: group.Key.StudentId,
                    category: group.Key.Category,
                    difficulty: group.Key.Difficulty,
                    totalAttempts: total,
                    passedAttempts: passed,
                    averageScore: avgScore,
                    averageRuntime: avgRuntime,
                    masteryScore: mastery,
                    isWeakArea: isWeak)
                {
                    LastAttemptedAt = lastAttempted
                };
                newProfiles.Add(profile);
            }
        }

        if (newProfiles.Count > 0)
        {
            _db.StudentSkillProfiles.AddRange(newProfiles);
        }

        await _db.SaveChangesAsync(ct);

        _logger.LogInformation(
            "Skill profile refresh done. Students: {Students}, New profiles: {New}, Updated: {Updated}, Weak areas flagged: {Weak}",
            studentIds.Count,
            newProfiles.Count,
            updatedProfiles.Count,
            newProfiles.Count(p => p.IsWeakArea) + updatedProfiles.Count(p => p.IsWeakArea));
    }
}