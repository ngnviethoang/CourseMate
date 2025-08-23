using CourseMate.Services.Dtos.Notifications;

namespace CourseMate.Services.Notifications;

public interface INotificationAppService : IApplicationService
{
    Task<PagedResultDto<NotificationDto>> GetListAsync(GetListNotificationRequestDto input);
    Task MarkReadAsync(IEnumerable<Guid> input);
}