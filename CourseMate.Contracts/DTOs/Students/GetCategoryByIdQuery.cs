using MediatR;

namespace CourseMate.Contracts.DTOs.Students;

public class GetCategoryByIdQuery : IRequest<CategoryDto?>
{
    public Guid Id { get; set; }
}