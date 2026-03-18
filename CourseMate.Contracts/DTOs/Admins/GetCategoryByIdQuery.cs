using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class GetCategoryByIdQuery : IRequest<CategoryDto?>
{
    public Guid Id { get; set; }
}