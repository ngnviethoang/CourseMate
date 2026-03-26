using MediatR;

namespace CourseMate.Contracts.DTOs.Auth;

public class ChangePasswordCommand : IRequest<int>
{
    public string NewPassword { get; set; } = string.Empty;

    public string OldPassword { get; set; } = string.Empty;
}