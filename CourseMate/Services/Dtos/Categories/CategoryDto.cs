using Volo.Abp.Application.Dtos;

namespace CourseMate.Services.Dtos.Categories;

public class CategoryDto : AuditedEntityDto<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}