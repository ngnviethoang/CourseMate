using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

/// <summary>
/// Tracks how the student performs per category/difficulty so we can surface their
/// weakest areas and recommend remedial courses, contests or exercises.
/// The system refreshes this table every time the student submits an exercise, contest
/// submission or finishes a lesson.
/// </summary>
public class StudentSkillProfile : Entity
{
    public StudentSkillProfile(
        Guid id,
        Guid studentId,
        string category,
        ExerciseDifficultyType difficulty,
        int totalAttempts,
        int passedAttempts,
        double averageScore,
        double averageRuntime,
        double masteryScore,
        bool isWeakArea) : base(id)
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

    /// <summary>Category name from Exercise.Category, normalized.</summary>
    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Category { get; set; }

    public ExerciseDifficultyType Difficulty { get; set; }

    public int TotalAttempts { get; set; }

    public int PassedAttempts { get; set; }

    public double AverageScore { get; set; }

    public double AverageRuntime { get; set; }

    /// <summary>
    /// 0..1 metric representing how well the student masters this (category, difficulty) bucket.
    /// Derived from pass rate, average score and recency.
    /// </summary>
    public double MasteryScore { get; set; }

    /// <summary>Convenience flag — true when MasteryScore is below the configured threshold.</summary>
    public bool IsWeakArea { get; set; }

    public DateTimeOffset LastAttemptedAt { get; set; }
}
