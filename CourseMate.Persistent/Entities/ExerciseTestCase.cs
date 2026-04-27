using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class ExerciseTestCase : Entity
{
    public ExerciseTestCase(Guid id, Guid exerciseId, string input, string expectedOutput, string description, bool isHidden, int order)
        : base(id)
    {
        ExerciseId = exerciseId;
        Input = input;
        ExpectedOutput = expectedOutput;
        Description = description;
        IsHidden = isHidden;
        Order = order;
    }

    public Guid ExerciseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Input { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string ExpectedOutput { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Description { get; set; }

    public bool IsHidden { get; set; }

    public int Order { get; set; }
}