using System.ComponentModel.DataAnnotations.Schema;

namespace CourseMate.Entities.Exercises.MultipleChoiceExercises;

public class MultipleChoiceExercise : FullAuditedEntity<Guid>
{
    public Dictionary<int, string> Options { get; set; }

    public int CorrectAnswer { get; set; }

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Explanation { get; set; }

    public Guid ExerciseId { get; set; }

    public MultipleChoiceExercise(Guid id, Dictionary<int, string> options, int correctAnswer, string explanation) : base(id)
    {
        Options = options;
        CorrectAnswer = correctAnswer;
        Explanation = explanation;
    }
}