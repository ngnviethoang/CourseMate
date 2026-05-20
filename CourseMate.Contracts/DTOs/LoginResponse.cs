namespace CourseMate.Contracts.DTOs;

public class LoginResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = [];
}