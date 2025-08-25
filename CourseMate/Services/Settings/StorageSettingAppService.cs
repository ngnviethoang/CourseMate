using CourseMate.Services.Dtos.Settings;
using CourseMate.Settings;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.SettingManagement;
using SettingManagementPermissions = CourseMate.Permissions.SettingManagementPermissions;

namespace CourseMate.Services.Settings;

[Authorize(SettingManagementPermissions.Storages.Default)]
public class StorageSettingAppService : SettingManagementAppServiceBase, IStorageSettingAppService
{
    private readonly ISettingManager _settingManager;

    public StorageSettingAppService(ISettingManager settingManager)
    {
        _settingManager = settingManager;
    }

    public async Task<StorageSettingDto> GetAsync()
    {
        StorageSettingDto settingsDto = new()
        {
            AllowFileExtension = await _settingManager.GetOrNullGlobalAsync(StorageSettingNames.AllowFileExtension) ?? string.Empty,
            ImageMaxSize = Convert.ToInt64(await _settingManager.GetOrNullGlobalAsync(StorageSettingNames.ImageMaxSize)),
            VideoMaxSize = Convert.ToInt64(await _settingManager.GetOrNullGlobalAsync(StorageSettingNames.VideoMaxSize))
        };

        return settingsDto;
    }

    public async Task UpdateAsync(StorageSettingDto input)
    {
        await _settingManager.SetGlobalAsync(StorageSettingNames.AllowFileExtension, input.AllowFileExtension);
        await _settingManager.SetGlobalAsync(StorageSettingNames.ImageMaxSize, input.ImageMaxSize.ToString());
        await _settingManager.SetGlobalAsync(StorageSettingNames.VideoMaxSize, input.VideoMaxSize.ToString());
    }
}