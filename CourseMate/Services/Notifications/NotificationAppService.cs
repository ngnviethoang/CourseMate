using CourseMate.Entities.Notifications;
using CourseMate.Services.Dtos.Notifications;
using Microsoft.AspNetCore.Authorization;

namespace CourseMate.Services.Notifications;

[Authorize]
public class NotificationAppService : CourseMateAppService, INotificationAppService
{
    public async Task<PagedResultDto<NotificationDto>> GetListAsync(GetListNotificationRequestDto input)
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

        queryable = queryable
            .WhereIf(input.ReceiverUserId.HasValue, i => i.ReceiverUserId == input.ReceiverUserId!.Value)
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? nameof(NotificationDto.CreationTime) : input.Sorting);

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

    public async Task MarkReadAsync(IEnumerable<Guid> input)
    {
        List<Notification> notifications = await NotificationRepo.GetListAsync(i => input.Contains(i.Id));
        notifications.ForEach(notification => notification.IsRead = true);
        await NotificationRepo.UpdateManyAsync(notifications);
    }
}