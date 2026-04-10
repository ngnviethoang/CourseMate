using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CourseMate.Contracts.DTOs.Auth;

public class RegisterCommand : IRequest<int>
{
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string Role { get; set; } = string.Empty;
}