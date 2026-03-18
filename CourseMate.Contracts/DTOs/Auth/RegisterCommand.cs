using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CourseMate.Contract.DTOs.Auth;

public class RegisterCommand : IRequest
{
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;
}