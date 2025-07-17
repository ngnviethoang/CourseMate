using CourseMate.Services.Dtos.Lookups;
using CourseMate.Shared.Constants;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;

namespace CourseMate.Services.Lookups;

public class LookupAppService : CourseMateAppService, ILookupAppService
{
    public async Task<PagedResultDto<LookupDto>> GetCategoriesAsync(LookupRequestDto input)
    {
        IQueryable<LookupDto> queryable =
            from course in await CategoryRepo.GetQueryableAsync()
            select new LookupDto
            {
                Id = course.Id,
                Name = course.Name,
                CreatorId = course.CreatorId
            };

        BuildPagedResultAsync(queryable, input);
        List<LookupDto> items = await AsyncExecuter.ToListAsync(queryable);
        int totalCount = await CategoryRepo.CountAsync();
        return new PagedResultDto<LookupDto>(totalCount, items);
    }

    public async Task<PagedResultDto<LookupDto>> GetCoursesAsync(LookupRequestDto input)
    {
        IQueryable<LookupDto> queryable =
            from category in await CourseRepo.GetQueryableAsync()
            select new LookupDto
            {
                Id = category.Id,
                Name = category.Title,
                CreatorId = category.CreatorId
            };

        BuildPagedResultAsync(queryable, input);
        List<LookupDto> items = await AsyncExecuter.ToListAsync(queryable);
        int totalCount = await CourseRepo.CountAsync();
        return new PagedResultDto<LookupDto>(totalCount, items);
    }

    public async Task<PagedResultDto<LookupDto>> GetChaptersAsync(LookupRequestDto input)
    {
        IQueryable<LookupDto> queryable =
            from chapter in await ChapterRepo.GetQueryableAsync()
            select new LookupDto
            {
                Id = chapter.Id,
                Name = chapter.Title,
                CreatorId = chapter.CreatorId
            };

        BuildPagedResultAsync(queryable, input);
        List<LookupDto> items = await AsyncExecuter.ToListAsync(queryable);
        int totalCount = await ChapterRepo.CountAsync();
        return new PagedResultDto<LookupDto>(totalCount, items);
    }

    public async Task<int> GetMaxPositionChaptersAsync(Guid courseId)
    {
        IQueryable<int> query =
            from chapter in await ChapterRepo.GetQueryableAsync()
            where chapter.CourseId == courseId
            select chapter.Position;
        List<int> sortNumber = await AsyncExecuter.ToListAsync(query);
        return sortNumber.Count != 0 ? sortNumber.Max() : 0;
    }

    public async Task<int> GetMaxPositionLessonsAsync(Guid chapterId)
    {
        IQueryable<int> query =
            from lesson in await LessonRepo.GetQueryableAsync()
            where lesson.ChapterId == chapterId
            select lesson.Position;
        List<int> sortNumber = await AsyncExecuter.ToListAsync(query);
        return sortNumber.Count != 0 ? sortNumber.Max() : 0;
    }

    private void BuildPagedResultAsync(IQueryable<LookupDto> queryable, LookupRequestDto input)
    {
        queryable = queryable
            .WhereIf(!CurrentUser.IsInRole(RoleConst.Admin), i => i.CreatorId == CurrentUser.Id)
            .WhereIf(!input.Filter.IsNullOrEmpty(), i => i.Name.Contains(input.Filter!));

        if (input.SkipCount.HasValue)
        {
            queryable = queryable.Skip(input.SkipCount.Value);
        }

        if (input.MaxResultCount.HasValue)
        {
            queryable = queryable.Take(input.MaxResultCount.Value);
        }
    }
}