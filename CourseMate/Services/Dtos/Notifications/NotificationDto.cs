namespace CourseMate.Services.Dtos.Notifications;

public class NotificationDto : AuditedEntityDto<Guid>
{
    public Guid ReceiverUserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; }
}