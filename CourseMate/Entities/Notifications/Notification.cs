using Volo.Abp.Domain.Entities.Auditing;

namespace CourseMate.Entities.Notifications;

public class Notification : FullAuditedEntity<Guid>
{
    public Notification(Guid id, Guid receiverUserId, string title, string content, bool isRead) : base(id)
    {
        ReceiverUserId = receiverUserId;
        Title = title;
        Content = content;
        IsRead = isRead;
    }

    public Guid ReceiverUserId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public bool IsRead { get; set; }
}