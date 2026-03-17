namespace CourseMate.Contract.DTOs.Admins;

public class UserDto
{
    public Guid Id { get; set; }

    public string? UserName { get; set; } = string.Empty;

    public string? Email { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; } = string.Empty;

    public DateTimeOffset CreationTime { get; set; }

    public DateTimeOffset? LastModificationTime { get; set; }
}