using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class ExerciseExample : Entity
{
    public ExerciseExample(Guid id, Guid exerciseId, string input, string output, string explanation) : base(id)
    {
        Input = input;
        Output = output;
        Explanation = explanation;
        ExerciseId = exerciseId;
    }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Input { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Output { get; set; }

    [MaxLength(CourseMateConsts.DescriptionMaxLength)]
    public string Explanation { get; set; }

    public Guid ExerciseId { get; set; }
}