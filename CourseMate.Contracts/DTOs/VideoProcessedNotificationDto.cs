namespace CourseMate.Contracts.DTOs;

public class VideoProcessedNotificationDto
{
    public Guid UserId { get; set; }
    public Guid FileId { get; set; }
    public string FileUrl { get; set; } = string.Empty;
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}