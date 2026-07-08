namespace CourseMate.Contracts.DTOs;

public class StudentSkillAnalysisDto
{
    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public DateTimeOffset GeneratedAt { get; set; }

    public OverallMasteryDto Overall { get; set; } = new();

    public List<SkillAreaDto> Strengths { get; set; } = new();

    public List<SkillAreaDto> WeakAreas { get; set; } = new();

    public List<SkillProgressPointDto> RecentProgress { get; set; } = new();

    public List<RecommendedExerciseDto> RecommendedExercises { get; set; } = new();

    public List<RecommendedCourseDto> RecommendedCourses { get; set; } = new();

    public List<string> Tips { get; set; } = new();
}

public class OverallMasteryDto
{
    public double MasteryScore { get; set; }

    public string SkillLevel { get; set; } = string.Empty;

    public int TotalAttempts { get; set; }

    public int PassedAttempts { get; set; }

    public double PassRate { get; set; }

    public int AttemptedExercises { get; set; }

    public int CategoriesCovered { get; set; }
}

public class SkillAreaDto
{
    public string Category { get; set; } = string.Empty;

    public string Difficulty { get; set; } = string.Empty;

    public int DifficultyLevel { get; set; }

    public int TotalAttempts { get; set; }

    public int PassedAttempts { get; set; }

    public double PassRate { get; set; }

    public double AverageScore { get; set; }

    public double MasteryScore { get; set; }

    public bool IsWeakArea { get; set; }

    public string Summary { get; set; } = string.Empty;

    public List<string> ImprovementHints { get; set; } = new();

    public DateTimeOffset LastAttemptedAt { get; set; }
}

public class SkillProgressPointDto
{
    public string Date { get; set; } = string.Empty;

    public int Submissions { get; set; }

    public int Passed { get; set; }

    public double PassRate { get; set; }
}

public class RecommendedExerciseDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Difficulty { get; set; } = string.Empty;

    public string Reason { get; set; } = string.Empty;

    public string CreatorName { get; set; } = string.Empty;
}

public class RecommendedCourseDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string CategoryName { get; set; } = string.Empty;

    public string Reason { get; set; } = string.Empty;

    public string InstructorName { get; set; } = string.Empty;
}