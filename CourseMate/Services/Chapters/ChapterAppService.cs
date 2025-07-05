using System.Linq.Dynamic.Core;
using CourseMate.Entities.Chapters;
using CourseMate.Permissions;
using CourseMate.Services.Dtos;
using CourseMate.Services.Dtos.Chapters;
using CourseMate.Shared.Constants;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Validation;

namespace CourseMate.Services.Chapters;

[Authorize(CourseMatePermissions.Chapters.Default)]
public class ChapterAppService : CourseMateAppService, IChapterAppService
{
    public async Task<ChapterDto> GetAsync(Guid id)
    {
        IQueryable<ChapterDto> queryable =
            from chapter in await ChapterRepo.GetQueryableAsync()
            where chapter.Id == id
            select new ChapterDto
            {
                Id = chapter.Id,
                Title = chapter.Title,
                CreationTime = chapter.CreationTime,
                CreatorId = chapter.CreatorId,
                LastModificationTime = chapter.LastModificationTime,
                LastModifierId = chapter.LastModifierId
            };
        return await AsyncExecuter.FirstOrDefaultAsync(queryable) ?? new ChapterDto();
    }

    public async Task<PagedResultDto<ChapterDto>> GetListAsync(GetListRequestDto input)
    {
        IQueryable<ChapterDto> queryable =
            from chapter in await ChapterRepo.GetQueryableAsync()
            select new ChapterDto
            {
                Id = chapter.Id,
                Title = chapter.Title,
                CreationTime = chapter.CreationTime,
                CreatorId = chapter.CreatorId,
                LastModificationTime = chapter.LastModificationTime,
                LastModifierId = chapter.LastModifierId
            };

        if (input.SkipCount.HasValue)
        {
            queryable = queryable.Skip(input.SkipCount.Value);
        }

        if (input.MaxResultCount.HasValue)
        {
            queryable = queryable.Take(input.MaxResultCount.Value);
        }

        List<ChapterDto> chapters = await AsyncExecuter.ToListAsync(queryable);
        int totalCount = await AsyncExecuter.CountAsync(queryable);
        return new PagedResultDto<ChapterDto>(totalCount, chapters);
    }

    [Authorize(CourseMatePermissions.Chapters.Create)]
    public async Task<ResultObjectDto> CreateAsync(CreateUpdateChapterDto input)
    {
        await CourseRepo.EnsureExistsAsync(input.CourseId);
        Chapter chapter = new(GuidGenerator.Create(), input.Title, input.CourseId);
        await ChapterRepo.InsertAsync(chapter);
        return new ResultObjectDto(chapter.Id);
    }

    [Authorize(CourseMatePermissions.Chapters.Edit)]
    public async Task<ChapterDto> UpdateAsync(Guid id, CreateUpdateChapterDto input)
    {
        await CourseRepo.EnsureExistsAsync(input.CourseId);
        Chapter chapter = await ChapterRepo.GetAsync(id);

        chapter.Title = input.Title;
        chapter.CourseId = input.CourseId;

        await ChapterRepo.UpdateAsync(chapter);
        return new ChapterDto
        {
            Id = chapter.Id,
            Title = chapter.Title,
            CreationTime = chapter.CreationTime,
            CreatorId = chapter.CreatorId,
            LastModificationTime = chapter.LastModificationTime,
            LastModifierId = chapter.LastModifierId
        };
    }

    [Authorize(CourseMatePermissions.Chapters.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        if (await LessonRepo.AnyAsync(i => i.ChapterId == id))
        {
            throw new AbpValidationException(ExceptionConst.InvalidRequest);
        }

        await ChapterRepo.DeleteAsync(id);
    }
}