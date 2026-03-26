using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
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

    public RegisterRole Role { get; set; } = RegisterRole.Student;
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum RegisterRole
{
    Student,
    Instructor
}