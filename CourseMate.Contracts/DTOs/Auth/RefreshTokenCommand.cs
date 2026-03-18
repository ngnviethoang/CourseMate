using MediatR;

namespace CourseMate.Contract.DTOs.Auth;

public class RefreshTokenCommand : IRequest
{
    public string Token { get; set; } = string.Empty;
}