using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class UpdateUserCommand : IRequest
{
    public Guid Id { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;
}