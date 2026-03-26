using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CourseMate.Contracts.DTOs.Auth;

public class UpdateProfileCommand : IRequest
{
    [EmailAddress]
    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public string? UserName { get; set; }
}