using System.Linq.Dynamic.Core;
using CourseMate.Entities.Chapters;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Chapters;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;

namespace CourseMate.Services.Chapters;

[Authorize(CourseMatePermissions.Chapters.Default)]
public class ChapterAppService : CourseMateAppService, IChapterAppService
{
    public async Task<ChapterDto> GetAsync(Guid id)
    {
        Chapter chapter = await ChapterRepo.GetAsync(id);
        return ObjectMapper.Map<Chapter, ChapterDto>(chapter);
    }

    public async Task<PagedResultDto<ChapterDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        IQueryable<Chapter> queryable = await ChapterRepo.GetQueryableAsync();
        IQueryable<Chapter> query = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "Name" : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        List<Chapter> categories = await AsyncExecuter.ToListAsync(query);
        int totalCount = await AsyncExecuter.CountAsync(queryable);

        return new PagedResultDto<ChapterDto>(totalCount, ObjectMapper.Map<List<Chapter>, List<ChapterDto>>(categories)
        );
    }

    [Authorize(CourseMatePermissions.Chapters.Create)]
    public async Task<ChapterDto> CreateAsync(CreateUpdateChapterDto input)
    {
        Chapter category = ObjectMapper.Map<CreateUpdateChapterDto, Chapter>(input);
        await ChapterRepo.InsertAsync(category);
        return ObjectMapper.Map<Chapter, ChapterDto>(category);
    }

    [Authorize(CourseMatePermissions.Chapters.Edit)]
    public async Task<ChapterDto> UpdateAsync(Guid id, CreateUpdateChapterDto input)
    {
        Chapter chapter = await ChapterRepo.GetAsync(id);
        ObjectMapper.Map(input, chapter);
        await ChapterRepo.UpdateAsync(chapter);
        return ObjectMapper.Map<Chapter, ChapterDto>(chapter);
    }

    [Authorize(CourseMatePermissions.Chapters.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await ChapterRepo.DeleteAsync(id);
    }
}