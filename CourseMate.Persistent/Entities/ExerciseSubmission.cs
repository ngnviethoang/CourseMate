using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class ExerciseSubmission : Entity
{
    public ExerciseSubmission(Guid id, Guid exerciseId, string language, string code, bool isPassed, double score, double totalTime, double totalMemory)
        : base(id)
    {
        ExerciseId = exerciseId;
        Language = language;
        Code = code;
        IsPassed = isPassed;
        Score = score;
        TotalTime = totalTime;
        TotalMemory = totalMemory;
    }

    public Guid ExerciseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Language { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Code { get; set; }

    public bool IsPassed { get; set; }

    public double Score { get; set; }

    public double TotalTime { get; set; }

    public double TotalMemory { get; set; }
}