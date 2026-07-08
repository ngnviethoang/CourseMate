using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Services.SkillAnalysisServices;

public interface ISkillAnalysisService
{
    Task<StudentSkillAnalysisDto> BuildAnalysisAsync(Guid studentId, CancellationToken ct);
}

public class SkillAnalysisService : ISkillAnalysisService
{
    private const int WeakAreaMinAttempts = 3;
    private const double WeakAreaMasteryThreshold = 0.5;
    private const int RecentDaysWindow = 14;

    private readonly CourseMateReadOnlyDbContext _db;

    public SkillAnalysisService(CourseMateReadOnlyDbContext db)
    {
        _db = db;
    }

    public async Task<StudentSkillAnalysisDto> BuildAnalysisAsync(Guid studentId, CancellationToken ct)
    {
        var allSubmissions = await (
            from s in _db.ExerciseSubmissions
            join e in _db.Exercises on s.ExerciseId equals e.Id
            where s.UserId == studentId
                  && !s.IsDeleted
                  && !e.IsDeleted
            select new
            {
                s.ExerciseId,
                e.Category,
                Difficulty = (int)e.Difficulty,
                s.IsPassed,
                s.Score,
                s.TotalTime,
                s.CreationTime
            }
        ).AsNoTracking().ToListAsync(ct);

        string studentName = await _db.Users
            .Where(u => u.Id == studentId)
            .Select(u => u.UserName ?? "Student")
            .FirstOrDefaultAsync(ct) ?? "Student";

        List<SkillAreaDto> grouped = allSubmissions
            .GroupBy(x => new { Category = x.Category.Trim(), x.Difficulty })
            .Where(g => !string.IsNullOrEmpty(g.Key.Category))
            .Select(g =>
            {
                var items = g.ToList();
                int total = items.Count;
                int passed = items.Count(i => i.IsPassed);
                double passRate = total == 0 ? 0 : (double)passed / total;
                double avgScore = total == 0 ? 0 : items.Average(i => i.Score);
                double avgRuntime = total == 0 ? 0 : items.Average(i => i.TotalTime);
                double mastery = passRate * 0.7 + avgScore / 100.0 * 0.3;
                bool isWeak = total >= WeakAreaMinAttempts && mastery < WeakAreaMasteryThreshold;

                return new SkillAreaDto
                {
                    Category = g.Key.Category,
                    DifficultyLevel = g.Key.Difficulty,
                    Difficulty = DifficultyLabel(g.Key.Difficulty),
                    TotalAttempts = total,
                    PassedAttempts = passed,
                    PassRate = Math.Round(passRate * 100, 1),
                    AverageScore = Math.Round(avgScore, 1),
                    MasteryScore = Math.Round(mastery * 100, 1),
                    IsWeakArea = isWeak,
                    Summary = BuildSummary(g.Key.Category, g.Key.Difficulty, passRate, avgScore, total),
                    ImprovementHints = BuildHints(g.Key.Category, g.Key.Difficulty, avgScore, passRate),
                    LastAttemptedAt = items.Max(i => i.CreationTime)
                };
            })
            .ToList();

        List<SkillAreaDto> strengths = grouped
            .Where(a => !a.IsWeakArea && a.TotalAttempts > 0)
            .OrderByDescending(a => a.MasteryScore)
            .ThenByDescending(a => a.PassedAttempts)
            .Take(5)
            .ToList();

        List<SkillAreaDto> weakAreas = grouped
            .Where(a => a.IsWeakArea)
            .OrderBy(a => a.MasteryScore)
            .ThenBy(a => a.PassRate)
            .Take(5)
            .ToList();

        double overallMastery = grouped.Count == 0 ? 0 : grouped.Average(a => a.MasteryScore);
        string overallSkillLevel = DetermineSkillLevel(overallMastery, allSubmissions.Count);

        OverallMasteryDto overall = new()
        {
            MasteryScore = Math.Round(overallMastery, 1),
            SkillLevel = overallSkillLevel,
            TotalAttempts = allSubmissions.Count,
            PassedAttempts = allSubmissions.Count(s => s.IsPassed),
            PassRate = allSubmissions.Count == 0 ? 0 : Math.Round((double)allSubmissions.Count(s => s.IsPassed) / allSubmissions.Count * 100, 1),
            AttemptedExercises = allSubmissions.Select(s => s.ExerciseId).Distinct().Count(),
            CategoriesCovered = grouped.Count
        };

        DateTimeOffset cutoff = DateTimeOffset.UtcNow.AddDays(-RecentDaysWindow);
        List<SkillProgressPointDto> recentProgress = allSubmissions
            .Where(s => s.CreationTime >= cutoff)
            .GroupBy(s => s.CreationTime.Date)
            .OrderBy(g => g.Key)
            .Select(g => new SkillProgressPointDto
            {
                Date = g.Key.ToString("MM-dd"),
                Submissions = g.Count(),
                Passed = g.Count(x => x.IsPassed),
                PassRate = g.Count() == 0 ? 0 : Math.Round((double)g.Count(x => x.IsPassed) / g.Count() * 100, 1)
            })
            .ToList();

        List<RecommendedExerciseDto> recommendedExercises = await RecommendExercisesAsync(studentId, weakAreas, ct);
        List<RecommendedCourseDto> recommendedCourses = await RecommendCoursesAsync(studentId, weakAreas, ct);
        List<string> tips = BuildOverallTips(grouped, overall, weakAreas.Count);

        return new StudentSkillAnalysisDto
        {
            StudentId = studentId,
            StudentName = studentName,
            GeneratedAt = DateTimeOffset.UtcNow,
            Overall = overall,
            Strengths = strengths,
            WeakAreas = weakAreas,
            RecentProgress = recentProgress,
            RecommendedExercises = recommendedExercises,
            RecommendedCourses = recommendedCourses,
            Tips = tips
        };
    }

    private async Task<List<RecommendedExerciseDto>> RecommendExercisesAsync(Guid studentId, List<SkillAreaDto> weakAreas, CancellationToken ct)
    {
        if (weakAreas.Count == 0)
        {
            return new List<RecommendedExerciseDto>();
        }

        HashSet<string> weakCategorySet = weakAreas.Select(w => w.Category).ToHashSet(StringComparer.OrdinalIgnoreCase);
        HashSet<int> weakDifficultyLevels = weakAreas.Select(w => w.DifficultyLevel).Distinct().ToHashSet();
        List<Guid> attemptedExerciseIds = await _db.ExerciseSubmissions
            .Where(s => s.UserId == studentId)
            .Select(s => s.ExerciseId)
            .Distinct()
            .ToListAsync(ct);

        var candidates = await _db.Exercises
            .Where(e => !e.IsDeleted && weakCategorySet.Contains(e.Category.Trim()))
            .Where(e => !attemptedExerciseIds.Contains(e.Id))
            .Select(e => new
            {
                e.Id,
                e.Title,
                e.Category,
                e.Difficulty,
                DifficultyLevel = (int)e.Difficulty,
                CreatorName = _db.Users.Where(u => u.Id == e.CreatorId).Select(u => u.UserName).FirstOrDefault() ?? "Unknown"
            })
            .AsNoTracking()
            .Take(50)
            .ToListAsync(ct);

        return candidates
            .OrderBy(c => weakDifficultyLevels.Contains(c.DifficultyLevel) ? 0 : 1)
            .ThenBy(c => c.DifficultyLevel)
            .Take(5)
            .Select(c => new RecommendedExerciseDto
            {
                Id = c.Id,
                Title = c.Title,
                Category = c.Category,
                Difficulty = DifficultyLabel(c.DifficultyLevel),
                CreatorName = c.CreatorName,
                Reason = $"Phù hợp với điểm yếu của bạn ở chủ đề '{c.Category}' (mức {DifficultyLabel(c.DifficultyLevel)})."
            })
            .ToList();
    }

    private async Task<List<RecommendedCourseDto>> RecommendCoursesAsync(Guid studentId, List<SkillAreaDto> weakAreas, CancellationToken ct)
    {
        if (weakAreas.Count == 0)
        {
            return new List<RecommendedCourseDto>();
        }

        HashSet<string> weakCategorySet = weakAreas.Select(w => w.Category).ToHashSet(StringComparer.OrdinalIgnoreCase);

        List<Guid> matchingCategories = await _db.Categories
            .Where(c => !c.IsDeleted && weakCategorySet.Contains(c.Name.Trim()))
            .Select(c => c.Id)
            .ToListAsync(ct);

        if (matchingCategories.Count == 0)
        {
            return new List<RecommendedCourseDto>();
        }

        List<Guid> enrolledCourseIds = await _db.Enrollments
            .Where(e => e.StudentId == studentId)
            .Select(e => e.CourseId)
            .Distinct()
            .ToListAsync(ct);

        var courses = await _db.Courses
            .Where(c => !c.IsDeleted
                        && c.IsPublished
                        && matchingCategories.Contains(c.CategoryId)
                        && !enrolledCourseIds.Contains(c.Id))
            .OrderByDescending(c => c.CreationTime)
            .Take(50)
            .Select(c => new
            {
                c.Id,
                c.Title,
                CategoryName = _db.Categories.Where(cat => cat.Id == c.CategoryId).Select(cat => cat.Name).FirstOrDefault() ?? "",
                InstructorName = _db.Users.Where(u => u.Id == c.InstructorId).Select(u => u.UserName).FirstOrDefault() ?? "Unknown"
            })
            .AsNoTracking()
            .ToListAsync(ct);

        return courses
            .Take(5)
            .Select(c => new RecommendedCourseDto
            {
                Id = c.Id,
                Title = c.Title,
                CategoryName = c.CategoryName,
                InstructorName = c.InstructorName,
                Reason = $"Khoá học thuộc danh mục '{c.CategoryName}' — danh mục bạn đang yếu, nên học để cải thiện nền tảng."
            })
            .ToList();
    }

    private static string DetermineSkillLevel(double mastery, int totalAttempts)
    {
        if (totalAttempts == 0)
        {
            return "Chưa có dữ liệu";
        }

        if (mastery >= 85)
        {
            return "Xuất sắc";
        }

        if (mastery >= 70)
        {
            return "Thành thạo";
        }

        if (mastery >= 50)
        {
            return "Trung bình";
        }

        if (mastery >= 30)
        {
            return "Sơ cấp";
        }

        return "Mới bắt đầu";
    }

    private static string DifficultyLabel(int difficulty)
    {
        return difficulty switch
        {
            (int)ExerciseDifficultyType.Easy => "Dễ",
            (int)ExerciseDifficultyType.Medium => "Trung bình",
            (int)ExerciseDifficultyType.Hard => "Khó",
            _ => "Khác"
        };
    }

    private static string BuildSummary(string category, int difficulty, double passRate, double avgScore, int total)
    {
        if (total == 0)
        {
            return $"Chưa có lượt làm nào ở chủ đề '{category}'.";
        }

        string diff = DifficultyLabel(difficulty);
        double pct = passRate * 100;
        return $"Bạn đã làm {total} bài {diff} về '{category}', tỉ lệ đúng {pct:F0}%, điểm trung bình {avgScore:F1}/100.";
    }

    private static List<string> BuildHints(string category, int difficulty, double avgScore, double passRate)
    {
        List<string> hints = new();
        string diff = DifficultyLabel(difficulty);

        if (passRate < 0.4)
        {
            hints.Add($"Tỉ lệ đúng dưới 40% — nên xem lại lý thuyết nền tảng về '{category}' trước khi luyện thêm bài {diff}.");
        }
        else if (passRate < 0.7)
        {
            hints.Add($"Tỉ lệ đúng tạm ổn — hãy tập trung vào các bài {diff} bạn làm sai để rút kinh nghiệm.");
        }

        if (avgScore < 50)
        {
            hints.Add("Điểm trung bình dưới 50/100 — cần cải thiện tốc độ và độ chính xác.");
        }

        if (difficulty >= (int)ExerciseDifficultyType.Medium && passRate < 0.5)
        {
            hints.Add("Nên luyện thêm các bài Dễ trong cùng chủ đề trước khi nhảy sang bài Khó.");
        }

        if (hints.Count == 0)
        {
            hints.Add($"Bạn đang làm tốt chủ đề '{category}' — hãy thử thêm các bài {diff} mới để duy trì phong độ.");
        }

        return hints;
    }

    private static List<string> BuildOverallTips(List<SkillAreaDto> grouped, OverallMasteryDto overall, int weakCount)
    {
        List<string> tips = new();

        if (grouped.Count == 0)
        {
            tips.Add("Bạn chưa làm bài tập nào. Hãy bắt đầu với các bài Dễ để hệ thống ghi nhận năng lực của bạn.");
            return tips;
        }

        if (weakCount >= 3)
        {
            tips.Add($"Bạn đang yếu ở {weakCount} chủ đề — nên ưu tiên cải thiện từng chủ đề một, đừng làm dàn trải.");
        }
        else if (weakCount == 0)
        {
            tips.Add("Tuyệt vời! Bạn không có điểm yếu rõ ràng. Hãy thử thách bản thân với các bài Khó hơn.");
        }

        if (overall.PassRate < 50 && overall.TotalAttempts >= 5)
        {
            tips.Add("Tỉ lệ đúng tổng thể dưới 50% — nên đọc lại lý thuyết trước khi nộp bài.");
        }

        if (overall.MasteryScore >= 70)
        {
            tips.Add("Năng lực tổng thể đã tốt — hãy thử tham gia các cuộc thi để kiểm tra áp lực.");
        }
        else if (overall.MasteryScore < 30 && overall.TotalAttempts > 0)
        {
            tips.Add("Điểm tổng thể còn thấp. Nên dành 15-30 phút mỗi ngày luyện bài Dễ để xây nền tảng.");
        }

        return tips;
    }
}