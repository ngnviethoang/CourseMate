using CourseMate.Contracts.DTOs;

namespace CourseMate.Application.Services.NotificationServices;

public interface INotificationService
{
    Task SendNotificationToUserAsync(NotificationDto notificationDto, CancellationToken ct = default);
    Task NotifyDocumentProcessedAsync(NotificationDto notificationDto, CancellationToken ct = default);
    Task NotifyVideoProcessedAsync(VideoProcessedNotificationDto notificationDto, CancellationToken ct = default);
    Task<NotificationDto> CreateAndSendAsync(Guid receiverId, string title, string message, CancellationToken ct = default);
}