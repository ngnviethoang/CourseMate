using CourseMate.Services.Dtos;
using CourseMate.Services.Dtos.Notifications;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CourseMate.Services.Notifications;

public interface INotificationAppService : IApplicationService
{
    Task<PagedResultDto<NotificationDto>> GetListAsync(GetListRequestDto input);
    Task MarkReadAsync(List<Guid> input);
}