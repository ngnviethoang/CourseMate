using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class ExerciseSubmission : Entity
{
    public ExerciseSubmission(Guid id, Guid exerciseId, string language, string code, bool passed, double score, double totalTime, double totalMemory)
        : base(id)
    {
        ExerciseId = exerciseId;
        Language = language;
        Code = code;
        Passed = passed;
        Score = score;
        TotalTime = totalTime;
        TotalMemory = totalMemory;
    }

    public Guid ExerciseId { get; set; }
    
    // Using string to represent language ID e.g., "python-3.14"
    public string Language { get; set; }

    public string Code { get; set; }

    public bool Passed { get; set; }

    public double Score { get; set; }

    public double TotalTime { get; set; }

    public double TotalMemory { get; set; }

    public Exercise Exercise { get; set; }
}
