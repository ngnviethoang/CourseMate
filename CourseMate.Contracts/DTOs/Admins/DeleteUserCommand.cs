using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteUserCommand : IRequest
{
    public DeleteUserCommand(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}