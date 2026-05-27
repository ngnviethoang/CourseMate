using CourseMate.Contracts.Attributes;

namespace CourseMate.Contracts.DTOs;

public class LoginResponse
{
    [SensitiveData]
    public string AccessToken { get; set; } = string.Empty;
}