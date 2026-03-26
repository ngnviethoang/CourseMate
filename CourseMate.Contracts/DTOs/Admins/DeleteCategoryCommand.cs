using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteCategoryCommand : IRequest<int>
{
    public Guid Id { get; set; }
}