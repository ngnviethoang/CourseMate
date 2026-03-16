using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class CreateCategoryCommand : IRequest<ResultIdDto>
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}