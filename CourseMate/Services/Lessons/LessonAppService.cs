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
                VideoFile = lesson.VideoFile,
                Position = lesson.Position,
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
                VideoFile = lesson.VideoFile,
                Position = lesson.Position,
                CreationTime = lesson.CreationTime,
                CreatorId = lesson.CreatorId,
                LastModificationTime = lesson.LastModificationTime,
                LastModifierId = lesson.LastModifierId
            };
        queryable = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? nameof(Lesson.Title) : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        List<LessonDto> categories = await AsyncExecuter.ToListAsync(queryable);
        int totalCount = await LessonRepo.CountAsync();
        return new PagedResultDto<LessonDto>(totalCount, categories);
    }

    [Authorize(CourseMatePermissions.Lessons.Create)]
    public async Task<ResultObjectDto> CreateAsync(CreateUpdateLessonDto input)
    {
        bool isDuplicateName = await LessonRepo.AnyAsync(i => i.Title == input.Title);
        if (isDuplicateName)
        {
            throw new UserFriendlyException("Duplicate lesson name");
        }

        bool isDuplicateSortNumber = await LessonRepo.AnyAsync(i => i.Position == input.Position);
        if (input.Position != 0 && isDuplicateSortNumber)
        {
            throw new UserFriendlyException("Duplicate lesson sort number");
        }

        await ChapterRepo.EnsureExistsAsync(input.ChapterId);

        Lesson lesson = new(GuidGenerator.Create(), input.Title, input.ContentText, input.VideoFile, input.Duration, input.ChapterId, input.Position);
        await LessonRepo.InsertAsync(lesson);
        return new ResultObjectDto(lesson.Id);
    }

    [Authorize(CourseMatePermissions.Lessons.Edit)]
    public async Task<LessonDto> UpdateAsync(Guid id, CreateUpdateLessonDto input)
    {
        bool isDuplicateName = await LessonRepo.AnyAsync(i => i.Title == input.Title && i.Id != id);
        if (isDuplicateName)
        {
            throw new UserFriendlyException("Duplicate lesson name");
        }

        bool isDuplicateSortNumber = await LessonRepo.AnyAsync(i => i.Position == input.Position && i.Id != id);
        if (input.Position != 0 && isDuplicateSortNumber)
        {
            throw new UserFriendlyException("Duplicate lesson sort number");
        }

        await ChapterRepo.EnsureExistsAsync(input.ChapterId);
        Lesson lesson = await LessonRepo.GetAsync(id);

        lesson.Title = input.Title;
        lesson.ContentText = input.ContentText;
        lesson.VideoFile = input.VideoFile;
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
            VideoFile = lesson.VideoFile,
            Position = lesson.Position,
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