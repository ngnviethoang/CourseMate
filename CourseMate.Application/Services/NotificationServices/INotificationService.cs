using CourseMate.Contracts.DTOs;

namespace CourseMate.Application.Services.NotificationServices;

public interface INotificationService
{
    Task SendNotificationToUserAsync(NotificationDto notificationDto, CancellationToken cancellationToken = default);
    Task NotifyDocumentProcessedAsync(NotificationDto notificationDto, CancellationToken cancellationToken = default);
}