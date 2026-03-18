using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteCategoryCommand : IRequest
{
    public Guid Id { get; set; }
}