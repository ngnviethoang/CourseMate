using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class CreateUserCommand : IRequest<ResultIdDto>
{
    public string UserName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;
}