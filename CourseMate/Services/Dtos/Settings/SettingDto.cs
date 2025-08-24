namespace CourseMate.Services.Dtos.Settings;

public class SettingDto
{
    public string Name { get; set; }
    public string? Value { get; set; }
    public string? ProviderName { get; set; }
    public string? ProviderKey { get; set; }
}