using CourseMate.Services.Dtos.Settings;

namespace CourseMate.Services.Settings;

public interface ISettingAppService : IApplicationService
{
    Task<string> GetAsync(SettingDto input);
    Task UpdateAsync(SettingDto input);
}