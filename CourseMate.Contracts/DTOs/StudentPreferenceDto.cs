using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs;

public class StudentPreferenceDto
{
    public Guid Id { get; set; }

    public Guid StudentId { get; set; }

    public List<string> FavouriteCategories { get; set; } = new();

    public ExerciseDifficultyType? PreferredDifficulty { get; set; }

    public string LearningGoal { get; set; } = string.Empty;

    public int MinutesPerDay { get; set; }

    public string SkillLevel { get; set; } = string.Empty;

    public bool RecommendContests { get; set; }

    public bool RecommendExercises { get; set; }

    public bool AutoRefresh { get; set; }
}

public class UpsertStudentPreferenceRequest
{
    public List<string> FavouriteCategories { get; set; } = new();

    public ExerciseDifficultyType? PreferredDifficulty { get; set; }

    public string LearningGoal { get; set; } = string.Empty;

    public int MinutesPerDay { get; set; } = 30;

    public string SkillLevel { get; set; } = "beginner";

    public bool RecommendContests { get; set; } = true;

    public bool RecommendExercises { get; set; } = true;

    public bool AutoRefresh { get; set; } = true;
}
