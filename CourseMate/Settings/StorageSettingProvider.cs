using Volo.Abp.Settings;

namespace CourseMate.Settings;

public static class StorageSettingNames
{
    public const string AllowFileExtension = "Storage.AllowFileExtension";
    public const string VideoMaxSize = "Storage.VideoMaxSize";
    public const string ImageMaxSize = "Storage.ImageMaxSize";
}

public class StorageSettingProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        context.Add(
            new SettingDefinition(StorageSettingNames.AllowFileExtension, "jpg,mp4", isVisibleToClients: true),
            new SettingDefinition(StorageSettingNames.VideoMaxSize, "2147483648", isVisibleToClients: true), // 2GB
            new SettingDefinition(StorageSettingNames.ImageMaxSize, "5242880", isVisibleToClients: true) // 5MB
        );
    }
}