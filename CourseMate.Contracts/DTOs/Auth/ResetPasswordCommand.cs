using MediatR;

namespace CourseMate.Contract.DTOs.Auth;

public class ResetPasswordRequest : IRequest
{
    public string Email { get; set; } = string.Empty;
}