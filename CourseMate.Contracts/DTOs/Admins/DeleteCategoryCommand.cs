using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteCategoryCommand : IRequest
{
    public DeleteCategoryCommand(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}