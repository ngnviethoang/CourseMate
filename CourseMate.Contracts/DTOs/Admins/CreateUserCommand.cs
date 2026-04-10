using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts.DTOs.Commons;
using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class CreateUserCommand : IRequest<ResultIdDto>
{
    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty;
}