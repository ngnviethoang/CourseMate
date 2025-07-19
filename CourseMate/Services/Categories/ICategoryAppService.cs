using CourseMate.Services.Dtos.Categories;

namespace CourseMate.Services.Categories;

public interface ICategoryAppService : IApplicationService
{
    Task<CategoryDto> GetAsync(Guid id);
    Task<PagedResultDto<CategoryDto>> GetListAsync(GetListRequestDto input);
    Task<ResultObjectDto> CreateAsync(CreateUpdateCategoryDto input);
    Task<CategoryDto> UpdateAsync(Guid id, CreateUpdateCategoryDto input);
    Task DeleteAsync(Guid id);
}