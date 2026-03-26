using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class UpdateCategoryCommand : IRequest<int>
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}