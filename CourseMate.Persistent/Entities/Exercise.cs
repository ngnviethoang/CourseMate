using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public enum ExerciseDifficulty
{
    Easy = 0,
    Medium = 1,
    Hard = 2
}

public class ExerciseExample
{
    public string Input { get; set; } = string.Empty;
    public string Output { get; set; } = string.Empty;
    public string? Explanation { get; set; }
}

public class Exercise : Entity
{
    public Exercise(Guid id, string title, string description, ExerciseDifficulty difficulty, string category, Guid createdById)
        : base(id)
    {
        Title = title;
        Description = description;
        Difficulty = difficulty;
        Category = category;
        CreatedById = createdById;
    }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; }

    [MaxLength(CourseMateConsts.DescriptionMaxLength)]
    public string Description { get; set; }

    public ExerciseDifficulty Difficulty { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Category { get; set; }

    public List<ExerciseExample> Examples { get; set; } = [];
    public List<string> Constraints { get; set; } = [];
    public List<string> Hints { get; set; } = [];

    /// <summary>FK to IdentityUser – người ra đề.</summary>
    public Guid CreatedById { get; set; }

    // Navigation
    public ICollection<ExerciseTestCase> TestCases { get; set; } = [];
    public ICollection<ExerciseDefaultCode> DefaultCodes { get; set; } = [];
}
