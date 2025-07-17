using System.Linq.Dynamic.Core;
using CourseMate.Entities.Categories;
using CourseMate.Permissions;
using CourseMate.Services.Dtos;
using CourseMate.Services.Dtos.Categories;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using CategoryDto = CourseMate.Services.Dtos.Categories.CategoryDto;

namespace CourseMate.Services.Categories;

[Authorize(CourseMatePermissions.Categories.Default)]
public class CategoryAppService : CourseMateAppService, ICategoryAppService
{
    public async Task<CategoryDto> GetAsync(Guid id)
    {
        IQueryable<CategoryDto> queryable =
            from category in await CategoryRepo.GetQueryableAsync()
            where category.Id == id
            select new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                CreationTime = category.CreationTime,
                CreatorId = category.CreatorId,
                LastModificationTime = category.LastModificationTime,
                LastModifierId = category.LastModifierId
            };
        return await AsyncExecuter.FirstOrDefaultAsync(queryable) ?? new CategoryDto();
    }

    public async Task<PagedResultDto<CategoryDto>> GetListAsync(GetListRequestDto input)
    {
        IQueryable<CategoryDto> queryable =
            from category in await CategoryRepo.GetQueryableAsync()
            select new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                CreationTime = category.CreationTime,
                CreatorId = category.CreatorId,
                LastModificationTime = category.LastModificationTime,
                LastModifierId = category.LastModifierId
            };
        queryable = queryable.OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "Name" : input.Sorting);

        if (input.SkipCount.HasValue)
        {
            queryable = queryable.Skip(input.SkipCount.Value);
        }

        if (input.MaxResultCount.HasValue)
        {
            queryable = queryable.Take(input.MaxResultCount.Value);
        }

        List<CategoryDto> categories = await AsyncExecuter.ToListAsync(queryable);
        int totalCount = await CategoryRepo.CountAsync();
        return new PagedResultDto<CategoryDto>(totalCount, categories);
    }

    [Authorize(CourseMatePermissions.Categories.Create)]
    public async Task<ResultObjectDto> CreateAsync(CreateUpdateCategoryDto input)
    {
        bool isDuplicateName = await CategoryRepo.AnyAsync(i => i.Name == input.Name);
        if (isDuplicateName)
        {
            throw new UserFriendlyException("Duplicate category name");
        }

        Category category = new(GuidGenerator.Create(), input.Name, input.Description);
        await CategoryRepo.InsertAsync(category);
        return new ResultObjectDto(category.Id);
    }

    [Authorize(CourseMatePermissions.Categories.Edit)]
    public async Task<CategoryDto> UpdateAsync(Guid id, CreateUpdateCategoryDto input)
    {
        bool isDuplicateName = await CategoryRepo.AnyAsync(i => i.Name == input.Name && i.Id != id);
        if (isDuplicateName)
        {
            throw new UserFriendlyException("Duplicate category name");
        }

        Category category = await CategoryRepo.GetAsync(id);
        category.Name = input.Name;
        category.Description = input.Name;
        await CategoryRepo.UpdateAsync(category);
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreationTime = category.CreationTime,
            CreatorId = category.CreatorId,
            LastModificationTime = category.LastModificationTime,
            LastModifierId = category.LastModifierId
        };
    }

    [Authorize(CourseMatePermissions.Categories.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        if (await CourseRepo.AnyAsync(i => i.CategoryId == id))
        {
            throw new UserFriendlyException("Cannot delete category because it is being used by one or more course.");
        }

        await CategoryRepo.DeleteAsync(id);
    }
}