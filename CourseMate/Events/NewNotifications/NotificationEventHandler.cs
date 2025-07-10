using CourseMate.Entities.Notifications;
using CourseMate.Hubs;
using Microsoft.AspNetCore.SignalR;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.Guids;

namespace CourseMate.Events.NewNotifications;

public class NotificationEventHandler : IDistributedEventHandler<NewNotificationEto>, ITransientDependency
{
    private readonly IRepository<Notification, Guid> _notificationRepo;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly IGuidGenerator _guidGenerator;

    public NotificationEventHandler(
        IRepository<Notification, Guid> notificationRepo,
        IHubContext<NotificationHub> hubContext,
        IGuidGenerator guidGenerator)
    {
        _notificationRepo = notificationRepo;
        _hubContext = hubContext;
        _guidGenerator = guidGenerator;
    }

    public async Task HandleEventAsync(NewNotificationEto eventData)
    {
        List<Notification> notifications = eventData.ReceiverUserIds
            .Select(userId => new Notification(
                id: _guidGenerator.Create(),
                receiverUserId: userId,
                title: eventData.Title,
                content: eventData.Content,
                isRead: false))
            .ToList();
        await _notificationRepo.InsertManyAsync(notifications, autoSave: true);

        foreach (Notification notify in notifications)
        {
            await _hubContext.Clients
                .User(notify.ReceiverUserId.ToString())
                .SendAsync("ReceiveNotification", new
                {
                    notify.Id,
                    notify.Title,
                    notify.Content,
                    notify.IsRead,
                    notify.CreationTime
                });
        }
    }
}