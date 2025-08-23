namespace CourseMate.Events.NewNotifications;

public class NewNotificationEto
{
    public IEnumerable<Guid> ReceiverUserIds { get; set; } = [];

    public bool IsBroadcast { get; set; }

    [MaxLength(1024)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2048)]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}