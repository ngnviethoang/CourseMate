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
    private readonly IGuidGenerator _guidGenerator;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly IRepository<Notification, Guid> _notificationRepo;

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
                _guidGenerator.Create(),
                userId,
                eventData.Title,
                eventData.Content,
                false))
            .ToList();
        await _notificationRepo.InsertManyAsync(notifications, true);

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