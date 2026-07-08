using System.ComponentModel.DataAnnotations;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class StudentSkillProfile : Entity
{
    public StudentSkillProfile(Guid id, Guid studentId, string category, int difficulty, int totalAttempts, int passedAttempts, double averageScore, double averageRuntime, double masteryScore, bool isWeakArea)
        : base(id)
    {
        StudentId = studentId;
        Category = category;
        Difficulty = difficulty;
        TotalAttempts = totalAttempts;
        PassedAttempts = passedAttempts;
        AverageScore = averageScore;
        AverageRuntime = averageRuntime;
        MasteryScore = masteryScore;
        IsWeakArea = isWeakArea;
    }

    public Guid StudentId { get; set; }

    [MaxLength(128)]
    public string Category { get; set; }

    public int Difficulty { get; set; }

    public int TotalAttempts { get; set; }

    public int PassedAttempts { get; set; }

    public double AverageScore { get; set; }

    public double AverageRuntime { get; set; }

    public double MasteryScore { get; set; }

    public bool IsWeakArea { get; set; }

    public DateTimeOffset LastAttemptedAt { get; set; }
}