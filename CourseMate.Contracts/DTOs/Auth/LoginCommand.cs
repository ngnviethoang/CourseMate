using MediatR;

namespace CourseMate.Contract.DTOs.Auth;

public class LoginCommand : IRequest<LoginResponse>
{
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}