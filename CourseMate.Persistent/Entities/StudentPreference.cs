using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

/// <summary>
/// Stores the explicit preference signals collected from each student:
/// favourite categories, favourite difficulty level, learning goals, time budget, etc.
/// This table is the primary input for the content-based component of the hybrid recommender.
/// </summary>
public class StudentPreference : Entity
{
    public StudentPreference(
        Guid id,
        Guid studentId,
        ICollection<string> favouriteCategories,
        ExerciseDifficultyType? preferredDifficulty,
        string learningGoal,
        int minutesPerDay,
        string skillLevel,
        bool recommendContests,
        bool recommendExercises,
        bool autoRefresh) : base(id)
    {
        StudentId = studentId;
        FavouriteCategories = favouriteCategories;
        PreferredDifficulty = preferredDifficulty;
        LearningGoal = learningGoal;
        MinutesPerDay = minutesPerDay;
        SkillLevel = skillLevel;
        RecommendContests = recommendContests;
        RecommendExercises = recommendExercises;
        AutoRefresh = autoRefresh;
    }

    public Guid StudentId { get; set; }

    /// <summary>Free-text category names that the student is most interested in.</summary>
    public ICollection<string> FavouriteCategories { get; set; }

    /// <summary>Optional preferred difficulty. Null means "no preference".</summary>
    public ExerciseDifficultyType? PreferredDifficulty { get; set; }

    [MaxLength(CourseMateConsts.DescriptionMaxLength)]
    public string LearningGoal { get; set; }

    /// <summary>How many minutes per day the student is willing to invest.</summary>
    public int MinutesPerDay { get; set; }

    /// <summary>Self-described skill level: "beginner", "intermediate", "advanced".</summary>
    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string SkillLevel { get; set; }

    public bool RecommendContests { get; set; }

    public bool RecommendExercises { get; set; }

    public bool AutoRefresh { get; set; }
}
