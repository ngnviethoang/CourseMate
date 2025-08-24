using Volo.Abp.Settings;

namespace CourseMate.Settings;

public static class StorageSettings
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
            new SettingDefinition(StorageSettings.AllowFileExtension, "jpg,mp4", isVisibleToClients: true),
            new SettingDefinition(StorageSettings.VideoMaxSize, "2147483648", isVisibleToClients: true), // 2GB
            new SettingDefinition(StorageSettings.ImageMaxSize, "5242880", isVisibleToClients: true) // 5MB
        );
    }
}