using CourseMate.Services.Dtos.Settings;

namespace CourseMate.Services.Settings;

public interface IStorageSettingAppService : IApplicationService
{
    Task<StorageSettingDto> GetAsync();
    Task UpdateAsync(StorageSettingDto input);
}