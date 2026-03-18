using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteUserCommand : IRequest
{
    public Guid Id { get; set; }
}