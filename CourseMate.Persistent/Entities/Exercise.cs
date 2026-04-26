using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class ExerciseExample
{
    public string Input { get; set; } = string.Empty;
    public string Output { get; set; } = string.Empty;
    public string? Explanation { get; set; }
}

public class Exercise : Entity
{
    public Exercise(Guid id, string title, string description, ExerciseDifficultyType difficulty, string category, Guid creatorId)
        : base(id)
    {
        Title = title;
        Description = description;
        Difficulty = difficulty;
        Category = category;
        CreatorId = creatorId;
    }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; }

    [MaxLength(CourseMateConsts.DescriptionMaxLength)]
    public string Description { get; set; }

    public ExerciseDifficultyType Difficulty { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Category { get; set; }

    public Guid CreatorId { get; set; }

    public ICollection<string> Constraints { get; set; }

    public ICollection<string> Hints { get; set; }

    // Navigation
    public ICollection<ExerciseExample> Examples { get; set; }
    public ICollection<ExerciseTestCase> TestCases { get; set; }
    public ICollection<ExerciseDefaultCode> DefaultCodes { get; set; }
}