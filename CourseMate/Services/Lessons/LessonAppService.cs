using System.Linq.Dynamic.Core;
using CourseMate.Entities.Lessons;
using CourseMate.Permissions;
using CourseMate.Services.Dtos;
using CourseMate.Services.Dtos.Lessons;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;

namespace CourseMate.Services.Lessons;

[Authorize(CourseMatePermissions.Lessons.Default)]
public class LessonAppService : CourseMateAppService, ILessonAppService
{
    public async Task<LessonDto> GetAsync(Guid id)
    {
        IQueryable<LessonDto> queryable =
            from lesson in await LessonRepo.GetQueryableAsync()
            where lesson.Id == id
            select new LessonDto
            {
                Id = lesson.Id,
                Title = lesson.Title,
                ChapterId = lesson.ChapterId,
                ContentText = lesson.ContentText,
                Duration = lesson.Duration,
                VideoUrl = lesson.VideoUrl,
                CreationTime = lesson.CreationTime,
                CreatorId = lesson.CreatorId,
                LastModificationTime = lesson.LastModificationTime,
                LastModifierId = lesson.LastModifierId
            };
        return await AsyncExecuter.FirstOrDefaultAsync(queryable) ?? new LessonDto();
    }

    public async Task<PagedResultDto<LessonDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        IQueryable<LessonDto> queryable =
            from lesson in await LessonRepo.GetQueryableAsync()
            select new LessonDto
            {
                Id = lesson.Id,
                Title = lesson.Title,
                ChapterId = lesson.ChapterId,
                ContentText = lesson.ContentText,
                Duration = lesson.Duration,
                VideoUrl = lesson.VideoUrl,
                CreationTime = lesson.CreationTime,
                CreatorId = lesson.CreatorId,
                LastModificationTime = lesson.LastModificationTime,
                LastModifierId = lesson.LastModifierId
            };
        queryable = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "Name" : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        List<LessonDto> categories = await AsyncExecuter.ToListAsync(queryable);
        int totalCount = await AsyncExecuter.CountAsync(queryable);
        return new PagedResultDto<LessonDto>(totalCount, categories);
    }

    [Authorize(CourseMatePermissions.Lessons.Create)]
    public async Task<ResultObjectDto> CreateAsync(CreateUpdateLessonDto input)
    {
        Lesson lesson = new(GuidGenerator.Create(), input.Title, input.ContentText, input.VideoUrl, input.Duration, input.ChapterId);
        await LessonRepo.InsertAsync(lesson);
        return new ResultObjectDto(lesson.Id);
    }

    [Authorize(CourseMatePermissions.Lessons.Edit)]
    public async Task<LessonDto> UpdateAsync(Guid id, CreateUpdateLessonDto input)
    {
        await ChapterRepo.EnsureExistsAsync(input.ChapterId);
        Lesson lesson = await LessonRepo.GetAsync(id);

        lesson.Title = input.Title;
        lesson.ContentText = input.ContentText;
        lesson.VideoUrl = input.VideoUrl;
        lesson.Duration = input.Duration;
        lesson.ChapterId = input.ChapterId;

        await LessonRepo.UpdateAsync(lesson);
        return new LessonDto
        {
            Id = lesson.Id,
            Title = lesson.Title,
            ChapterId = lesson.ChapterId,
            ContentText = lesson.ContentText,
            Duration = lesson.Duration,
            VideoUrl = lesson.VideoUrl,
            CreationTime = lesson.CreationTime,
            CreatorId = lesson.CreatorId,
            LastModificationTime = lesson.LastModificationTime,
            LastModifierId = lesson.LastModifierId
        };
    }

    [Authorize(CourseMatePermissions.Lessons.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await LessonRepo.DeleteAsync(id);
    }
}