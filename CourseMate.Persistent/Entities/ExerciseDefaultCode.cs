using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class ExerciseDefaultCode : Entity
{
    public ExerciseDefaultCode(Guid id, Guid exerciseId, string language, string starterCode)
        : base(id)
    {
        ExerciseId = exerciseId;
        Language = language;
        StarterCode = starterCode;
    }

    public Guid ExerciseId { get; set; }

    /// <summary>Tên ngôn ngữ: "javascript", "python", "java", "cpp", "csharp"</summary>
    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Language { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string StarterCode { get; set; }

    // Navigation
    public Exercise Exercise { get; set; } = null!;
}