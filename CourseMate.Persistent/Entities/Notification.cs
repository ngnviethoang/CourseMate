using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class Notification : Entity
{
    public Notification(Guid id, Guid receiverId, string title, string message, bool isRead) : base(id)
    {
        ReceiverId = receiverId;
        Title = title;
        Message = message;
        IsRead = isRead;
    }

    public Guid ReceiverId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Message { get; set; }

    public bool IsRead { get; set; }
}