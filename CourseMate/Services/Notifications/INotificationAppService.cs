using CourseMate.Services.Dtos.Notifications;

namespace CourseMate.Services.Notifications;

public interface INotificationAppService : IApplicationService
{
    Task<PagedResultDto<NotificationDto>> GetListAsync(GetListRequestDto input);
    Task MarkReadAsync(List<Guid> input);
}