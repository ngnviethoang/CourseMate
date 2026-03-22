using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CourseMate.Contracts.DTOs.Auth;

public class UpdateProfileCommand : IRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    public string UserName { get; set; } = string.Empty;
}