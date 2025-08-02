using CourseMate.Entities.Notifications;
using CourseMate.Services.Dtos.Notifications;
using Microsoft.AspNetCore.Authorization;

namespace CourseMate.Services.Notifications;

[Authorize]
public class NotificationAppService : CourseMateAppService, INotificationAppService
{
    [AllowAnonymous]
    public async Task<PagedResultDto<NotificationDto>> GetListAsync(GetListRequestDto input)
    {
        IQueryable<NotificationDto> queryable =
            from notification in await NotificationRepo.GetQueryableAsync()
            select new NotificationDto
            {
                Id = notification.Id,
                Title = notification.Title,
                CreationTime = notification.CreationTime,
                CreatorId = notification.CreatorId,
                Content = notification.Content,
                IsRead = notification.IsRead,
                LastModificationTime = notification.LastModificationTime,
                LastModifierId = notification.LastModifierId,
                ReceiverUserId = notification.ReceiverUserId
            };

        if (input.SkipCount.HasValue)
        {
            queryable = queryable.Skip(input.SkipCount.Value);
        }

        if (input.MaxResultCount.HasValue)
        {
            queryable = queryable.Take(input.MaxResultCount.Value);
        }

        List<NotificationDto> notifications = await AsyncExecuter.ToListAsync(queryable);
        int totalCount = await AsyncExecuter.CountAsync(queryable);
        return new PagedResultDto<NotificationDto>(totalCount, notifications);
    }

    public async Task MarkReadAsync(List<Guid> input)
    {
        IQueryable<Notification> queryable =
            from notification in await NotificationRepo.GetQueryableAsync()
            where input.Contains(notification.Id)
            select notification;

        List<Notification> notifications = await AsyncExecuter.ToListAsync(queryable);
        notifications.ForEach(notification => notification.IsRead = true);
        await NotificationRepo.UpdateManyAsync(notifications);
    }
}