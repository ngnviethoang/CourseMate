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
    public async Task SendNotificationToUserAsync(NotificationDto notificationDto, CancellationToken ct = default)
    {
        await hubContext.Clients.User(notificationDto.ReceiverId.ToString())
            .SendAsync("ReceiveNotification", notificationDto, ct);
    }

    public async Task NotifyDocumentProcessedAsync(NotificationDto notificationDto, CancellationToken ct = default)
    {
        await hubContext.Clients.User(notificationDto.ReceiverId.ToString())
            .SendAsync("DocumentProcessed", notificationDto, ct);
    }

    public async Task NotifyVideoProcessedAsync(VideoProcessedNotificationDto notificationDto, CancellationToken ct = default)
    {
        await hubContext.Clients.User(notificationDto.UserId.ToString())
            .SendAsync("VideoProcessed", notificationDto, ct);
    }

    public async Task<NotificationDto> CreateAndSendAsync(Guid receiverId, string title, string message, CancellationToken ct = default)
    {
        Notification notification = new(Guid.NewGuid(), receiverId, title, message, false);
        await dbContext.Notifications.AddAsync(notification, ct);
        await dbContext.SaveChangesAsync(ct);

        NotificationDto dto = new()
        {
            Id = notification.Id,
            ReceiverId = receiverId,
            LessonId = null,
            Title = title,
            Message = message,
            IsRead = false,
            CreationTime = notification.CreationTime
        };

        await hubContext.Clients.User(receiverId.ToString())
            .SendAsync("ReceiveNotification", dto, ct);

        return dto;
    }
}