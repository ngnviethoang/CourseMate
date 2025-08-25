namespace CourseMate.Services.Dtos.Settings;

public class StorageSettingDto
{
    public string AllowFileExtension { get; set; } = string.Empty;
    public long VideoMaxSize { get; set; }
    public long ImageMaxSize { get; set; }
}