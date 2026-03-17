using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class GetCategoryByIdQuery : IRequest<CategoryDto?>
{
    public GetCategoryByIdQuery(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}