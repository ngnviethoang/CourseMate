using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class ContestRegistration : Entity
{
    public ContestRegistration(Guid id, Guid contestId, Guid studentId, DateTimeOffset registrationTime, bool isDisqualified, string disqualifiedReason)
        : base(id)
    {
        ContestId = contestId;
        StudentId = studentId;
        RegistrationTime = registrationTime;
        IsDisqualified = isDisqualified;
        DisqualifiedReason = disqualifiedReason;
    }

    public Guid ContestId { get; set; }

    public Guid StudentId { get; set; }

    public DateTimeOffset RegistrationTime { get; set; }

    public DateTimeOffset? JoinTime { get; set; }

    public DateTimeOffset? SubmitTime { get; set; }

    public bool IsDisqualified { get; set; }

    public int ViolationCount { get; set; }

    public DateTimeOffset? DisqualifiedAt { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string DisqualifiedReason { get; set; }
}