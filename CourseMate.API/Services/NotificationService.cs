using CourseMate.API.Hubs;
using CourseMate.Application.Services.NotificationServices;
using CourseMate.Contracts.DTOs;
using Microsoft.AspNetCore.SignalR;

namespace CourseMate.API.Services;

public class NotificationService(IHubContext<NotificationHub> hubContext) : INotificationService
{
    public async Task SendNotificationToUserAsync(NotificationDto notificationDto, CancellationToken cancellationToken = default)
    {
        await hubContext.Clients.User(notificationDto.ReceiverId.ToString())
            .SendAsync("ReceiveNotification", notificationDto, cancellationToken);
    }

    public async Task NotifyDocumentProcessedAsync(NotificationDto notificationDto, CancellationToken cancellationToken = default)
    {
        await hubContext.Clients.User(notificationDto.ReceiverId.ToString())
            .SendAsync("DocumentProcessed", notificationDto, cancellationToken);
    }
}