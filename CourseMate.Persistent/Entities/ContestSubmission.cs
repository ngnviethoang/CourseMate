using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class ContestSubmission : Entity
{
    public ContestSubmission(Guid id, Guid contestId, Guid exerciseId, Guid studentId, string language, string code, int score, float totalTime, int totalMemory, DateTimeOffset creationTime, bool isFinal)
        : base(id)
    {
        ContestId = contestId;
        ExerciseId = exerciseId;
        StudentId = studentId;
        Language = language;
        Code = code;
        Score = score;
        TotalTime = totalTime;
        TotalMemory = totalMemory;
        IsFinal = isFinal;
    }

    public Guid ContestId { get; set; }

    public Guid ExerciseId { get; set; }

    public Guid StudentId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Language { get; set; }

    public string Code { get; set; }

    public int Score { get; set; }

    public float TotalTime { get; set; }

    public int TotalMemory { get; set; }

    public bool IsFinal { get; set; }

    public virtual Contest Contest { get; set; } = null!;

    public virtual Exercise Exercise { get; set; } = null!;
}
