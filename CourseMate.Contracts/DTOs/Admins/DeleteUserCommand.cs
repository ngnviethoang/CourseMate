using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteUserCommand : IRequest<int>
{
    public Guid Id { get; set; }
}