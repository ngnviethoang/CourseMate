using CourseMate.API.Hubs;
using CourseMate.Application.Services.NotificationServices;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.SignalR;

namespace CourseMate.API.Services;

public class NotificationService(
    IHubContext<NotificationHub> hubContext,
    CourseMateDbContext dbContext) : INotificationService
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

    public async Task<NotificationDto> CreateAndSendAsync(Guid receiverId, string title, string message, CancellationToken cancellationToken = default)
    {
        // 1. Persist to database
        Notification notification = new(Guid.NewGuid(), receiverId, title, message, false);
        await dbContext.Notifications.AddAsync(notification, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        // 2. Build DTO
        NotificationDto dto = new()
        {
            Id = notification.Id,
            ReceiverId = receiverId,
            Title = title,
            Message = message,
            IsRead = false,
            CreationTime = notification.CreationTime
        };

        // 3. Push via SignalR
        await hubContext.Clients.User(receiverId.ToString())
            .SendAsync("ReceiveNotification", dto, cancellationToken);

        return dto;
    }
}