namespace CourseMate.Contracts.DTOs;

public class NotificationDto
{
    public Guid Id { get; set; }
    public Guid ReceiverId { get; set; }
    public Guid? LessonId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTimeOffset CreationTime { get; set; }
}
