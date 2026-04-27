using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class Exercise : Entity
{
    public Exercise(Guid id, string title, string description, ExerciseDifficultyType difficulty, string category, Guid creatorId, ICollection<string> constraints, ICollection<string> hints)
        : base(id)
    {
        Title = title;
        Description = description;
        Difficulty = difficulty;
        Category = category;
        CreatorId = creatorId;
        Constraints = constraints;
        Hints = hints;
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
}