using CourseMate.Services.Dtos.Lookups;
using CourseMate.Shared.Constants;
using Volo.Abp.Application.Dtos;

namespace CourseMate.Services.Lookups;

public class LookupAppService : CourseMateAppService, ILookupAppService
{
    public async Task<PagedResultDto<LookupDto>> GetCategoriesAsync(LookupRequestDto input)
    {
        IQueryable<LookupDto> queryable = from course in await CourseRepo.GetQueryableAsync()
            select new LookupDto
            {
                Id = course.Id,
                Name = course.Title,
                CreatorId = course.CreatorId
            };

        return await BuildPagedResultAsync(queryable, input);
    }

    public async Task<PagedResultDto<LookupDto>> GetCoursesAsync(LookupRequestDto input)
    {
        IQueryable<LookupDto> queryable = from category in await CategoryRepo.GetQueryableAsync()
            select new LookupDto
            {
                Id = category.Id,
                Name = category.Name,
                CreatorId = category.CreatorId
            };

        return await BuildPagedResultAsync(queryable, input);
    }

    public async Task<PagedResultDto<LookupDto>> GetChaptersAsync(LookupRequestDto input)
    {
        IQueryable<LookupDto> queryable = from chapter in await ChapterRepo.GetQueryableAsync()
            select new LookupDto
            {
                Id = chapter.Id,
                Name = chapter.Title,
                CreatorId = chapter.CreatorId
            };

        return await BuildPagedResultAsync(queryable, input);
    }

    private async Task<PagedResultDto<LookupDto>> BuildPagedResultAsync(IQueryable<LookupDto> queryable, LookupRequestDto input)
    {
        queryable = queryable
            .WhereIf(!CurrentUser.IsInRole(RoleConst.Admin), i => i.CreatorId == CurrentUser.Id)
            .WhereIf(!input.Filter.IsNullOrEmpty(), i => i.Name.Contains(input.Filter!));

        int totalCount = await AsyncExecuter.CountAsync(queryable);

        if (input.SkipCount.HasValue)
        {
            queryable = queryable.Skip(input.SkipCount.Value);
        }

        if (input.MaxResultCount.HasValue)
        {
            queryable = queryable.Take(input.MaxResultCount.Value);
        }

        List<LookupDto> items = await AsyncExecuter.ToListAsync(queryable);
        return new PagedResultDto<LookupDto>(totalCount, items);
    }
}