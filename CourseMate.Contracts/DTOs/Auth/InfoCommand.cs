using MediatR;

namespace CourseMate.Contract.DTOs.Auth;

public class InfoCommand : IRequest
{
    public string NewEmail { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string OldPassword { get; set; } = string.Empty;
}