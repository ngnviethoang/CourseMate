using System.Linq.Dynamic.Core;
using CourseMate.Entities.Categories;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Categories;
using CourseMate.Shared.Constants;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;

namespace CourseMate.Services.Categories;

[Authorize(CourseMatePermissions.Categories.Default)]
public class CategoryAppService : CourseMateAppService, ICategoryAppService
{
    public async Task<CategoryDto> GetAsync(Guid id)
    {
        Category category = await CategoryRepo.GetAsync(id);
        return ObjectMapper.Map<Category, CategoryDto>(category);
    }

    public async Task<PagedResultDto<CategoryDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        IQueryable<Category> queryable = await CategoryRepo.GetQueryableAsync();
        IQueryable<Category> query = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "Name" : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        List<Category> categories = await AsyncExecuter.ToListAsync(query);
        int totalCount = await AsyncExecuter.CountAsync(queryable);

        return new PagedResultDto<CategoryDto>(totalCount, ObjectMapper.Map<List<Category>, List<CategoryDto>>(categories));
    }

    [Authorize(CourseMatePermissions.Categories.Create)]
    public async Task<CategoryDto> CreateAsync(CreateUpdateCategoryDto input)
    {
        Category category = ObjectMapper.Map<CreateUpdateCategoryDto, Category>(input);
        await CategoryRepo.InsertAsync(category);
        return ObjectMapper.Map<Category, CategoryDto>(category);
    }

    [Authorize(CourseMatePermissions.Categories.Edit)]
    public async Task<CategoryDto> UpdateAsync(Guid id, CreateUpdateCategoryDto input)
    {
        Category category = await CategoryRepo.GetAsync(id);
        ObjectMapper.Map(input, category);
        await CategoryRepo.UpdateAsync(category);
        return ObjectMapper.Map<Category, CategoryDto>(category);
    }

    [Authorize(CourseMatePermissions.Categories.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        if (await CourseRepo.AnyAsync(i => i.CategoryId == id))
        {
            throw new BusinessException(ExceptionConst.InvalidRequest);
        }

        await CategoryRepo.DeleteAsync(id);
    }
}