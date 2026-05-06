using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class ContestRegistration : Entity
{
    public ContestRegistration(Guid id, Guid contestId, Guid studentId, DateTimeOffset registrationTime, bool isDisqualified)
        : base(id)
    {
        ContestId = contestId;
        StudentId = studentId;
        RegistrationTime = registrationTime;
        IsDisqualified = isDisqualified;
    }

    public Guid ContestId { get; set; }

    public Guid StudentId { get; set; }

    public DateTimeOffset RegistrationTime { get; set; }

    public DateTimeOffset? JoinTime { get; set; }

    public DateTimeOffset? SubmitTime { get; set; }

    public bool IsDisqualified { get; set; }
}