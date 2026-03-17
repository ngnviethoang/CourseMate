using System.ComponentModel.DataAnnotations;
using CourseMate.Contract;
using CourseMate.Contract.Enums;
using CourseMate.Core.Entities.Abstracts;

namespace CourseMate.Core.Entities;

public class Notification : Entity
{
    public Notification(Guid id, Guid userId, string title, string message, bool isRead, NotificationType notificationType) : base(id)
    {
        UserId = userId;
        Title = title;
        Message = message;
        IsRead = isRead;
        NotificationType = notificationType;
    }

    public Guid UserId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Message { get; set; }

    public bool IsRead { get; set; }

    public NotificationType NotificationType { get; set; }
}