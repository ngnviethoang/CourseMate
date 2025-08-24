using CourseMate.Services.Dtos.Settings;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.SettingManagement;

namespace CourseMate.Services.Settings;

[Authorize(SettingManagementPermissions.GroupName)]
public class SettingAppService : CourseMateAppService, ISettingAppService
{
    private ISettingManager _settingManager;

    public SettingAppService(ISettingManager settingManager)
    {
        _settingManager = settingManager;
    }

    public async Task<string> GetAsync(SettingDto input)
    {
        return await _settingManager.GetOrNullAsync(input.Name, input.ProviderName, input.ProviderKey);
    }

    public async Task UpdateAsync(SettingDto input)
    {
        await _settingManager.SetAsync(input.Name, input.Value, input.ProviderName, input.ProviderKey, true);
    }
}