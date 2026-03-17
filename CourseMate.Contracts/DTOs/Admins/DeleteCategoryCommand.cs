using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class DeleteCategoryCommand : IRequest
{
    public DeleteCategoryCommand(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}