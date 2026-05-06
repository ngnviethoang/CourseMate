using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class ContestExercise : Entity
{
    public ContestExercise(Guid id, Guid contestId, Guid exerciseId, int scoreWeight, int order)
        : base(id)
    {
        ContestId = contestId;
        ExerciseId = exerciseId;
        ScoreWeight = scoreWeight;
        Order = order;
    }

    public Guid ContestId { get; set; }

    public Guid ExerciseId { get; set; }

    public int ScoreWeight { get; set; }

    public int Order { get; set; }
}