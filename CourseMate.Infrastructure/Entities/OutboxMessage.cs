using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Infrastructure.Entities.Abstracts;

namespace CourseMate.Infrastructure.Entities;

public class OutboxMessage : Entity
{
    public OutboxMessage(Guid id) : base(id)
    {
    }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string EventType { get; set; } = string.Empty;

    public Guid TriggeredById { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string ObjectId { get; set; } = string.Empty;

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Payload { get; set; } = string.Empty;

    public bool Published { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string ActivityId { get; set; } = string.Empty;
}