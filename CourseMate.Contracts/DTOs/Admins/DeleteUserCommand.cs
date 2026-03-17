using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class DeleteUserCommand : IRequest
{
    public DeleteUserCommand(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}