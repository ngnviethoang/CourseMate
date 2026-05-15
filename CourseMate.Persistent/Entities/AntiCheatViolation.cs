using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class AntiCheatViolation : Entity
{
    public AntiCheatViolation(Guid id, Guid contestId, Guid studentId,
        ViolationType violationType, string details, DateTimeOffset occurredAt)
        : base(id)
    {
        ContestId = contestId;
        StudentId = studentId;
        ViolationType = violationType;
        Details = details;
        OccurredAt = occurredAt;
    }

    public Guid ContestId { get; set; }

    public Guid StudentId { get; set; }

    public ViolationType ViolationType { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Details { get; set; }

    public DateTimeOffset OccurredAt { get; set; }
}