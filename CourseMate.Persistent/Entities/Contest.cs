using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class Contest : Entity
{
    public Contest(Guid id, string title, string description, ContestStatus status, DateTimeOffset? startTime, DateTimeOffset? endTime, int durationInMinutes, string allowedLanguages, int memoryLimit, int timeLimit, AntiCheatLevel antiCheatLevel, Guid creatorId)
        : base(id)
    {
        Title = title;
        Description = description;
        Status = status;
        StartTime = startTime;
        EndTime = endTime;
        DurationInMinutes = durationInMinutes;
        AllowedLanguages = allowedLanguages;
        MemoryLimit = memoryLimit;
        TimeLimit = timeLimit;
        AntiCheatLevel = antiCheatLevel;
        CreatorId = creatorId;
    }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; }

    [MaxLength(CourseMateConsts.DescriptionMaxLength)]
    public string Description { get; set; }

    public ContestStatus Status { get; set; }

    public DateTimeOffset? StartTime { get; set; }

    public DateTimeOffset? EndTime { get; set; }

    public int DurationInMinutes { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string AllowedLanguages { get; set; }

    public int MemoryLimit { get; set; }

    public int TimeLimit { get; set; }

    public AntiCheatLevel AntiCheatLevel { get; set; }

    public Guid CreatorId { get; set; }
}