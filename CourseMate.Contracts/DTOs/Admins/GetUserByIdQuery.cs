using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class GetUserByIdQuery : IRequest<UserDto?>
{
    public Guid Id { get; set; }
}