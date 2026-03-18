using MediatR;

namespace CourseMate.Contract.DTOs.Auth;

public class ResentConfirmEmailRequest : IRequest
{
    public string Email { get; set; } = string.Empty;
}