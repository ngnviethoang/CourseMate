using CourseMate.Entities.Chapters;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Chapters;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
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
            join course in await CourseRepo.GetQueryableAsync()
                on chapter.CourseId equals course.Id
            where chapter.Id == id
            select new ChapterDto
            {
                Id = chapter.Id,
                Title = chapter.Title,
                CreationTime = chapter.CreationTime,
                CreatorId = chapter.CreatorId,
                LastModificationTime = chapter.LastModificationTime,
                LastModifierId = chapter.LastModifierId,
                CourseId = chapter.CourseId,
                CourseTitle = course.Title
            };
        return await AsyncExecuter.FirstOrDefaultAsync(queryable) ?? new ChapterDto();
    }

    public async Task<PagedResultDto<ChapterDto>> GetListAsync(GetListRequestDto input)
    {
        IQueryable<ChapterDto> queryable =
            from chapter in await ChapterRepo.GetQueryableAsync()
            join course in await CourseRepo.GetQueryableAsync()
                on chapter.CourseId equals course.Id
            select new ChapterDto
            {
                Id = chapter.Id,
                Title = chapter.Title,
                CreationTime = chapter.CreationTime,
                CreatorId = chapter.CreatorId,
                Position = chapter.Position,
                LastModificationTime = chapter.LastModificationTime,
                LastModifierId = chapter.LastModifierId,
                CourseId = chapter.CourseId,
                CourseTitle = course.Title
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
        int totalCount = await ChapterRepo.CountAsync();
        return new PagedResultDto<ChapterDto>(totalCount, chapters);
    }

    [Authorize(CourseMatePermissions.Chapters.Create)]
    public async Task<ResultObjectDto> CreateAsync(CreateUpdateChapterDto input)
    {
        bool isDuplicateName = await ChapterRepo.AnyAsync(i => i.Title == input.Title);
        if (isDuplicateName)
        {
            throw new UserFriendlyException("Duplicate chapter name");
        }

        bool isDuplicateSortNumber = await ChapterRepo.AnyAsync(i => i.Position == input.Position);
        if (input.Position != 0 && isDuplicateSortNumber)
        {
            throw new UserFriendlyException("Duplicate chapter sort number");
        }

        await CourseRepo.EnsureExistsAsync(input.CourseId);

        Chapter chapter = new(GuidGenerator.Create(), input.Title, input.CourseId, input.Position);
        await ChapterRepo.InsertAsync(chapter);
        return new ResultObjectDto(chapter.Id);
    }

    [Authorize(CourseMatePermissions.Chapters.Edit)]
    public async Task<ChapterDto> UpdateAsync(Guid id, CreateUpdateChapterDto input)
    {
        bool isDuplicateName = await ChapterRepo.AnyAsync(i => i.Title == input.Title && i.Id != id);
        if (isDuplicateName)
        {
            throw new UserFriendlyException("Duplicate chapter name");
        }

        bool isDuplicateSortNumber = await ChapterRepo.AnyAsync(i => i.Position == input.Position && i.Id != id);
        if (input.Position != 0 && isDuplicateSortNumber)
        {
            throw new UserFriendlyException("Duplicate chapter sort number");
        }

        await CourseRepo.EnsureExistsAsync(input.CourseId);
        Chapter chapter = await ChapterRepo.GetAsync(id);

        chapter.Title = input.Title;
        chapter.CourseId = input.CourseId;
        chapter.Position = input.Position;

        await ChapterRepo.UpdateAsync(chapter);
        return new ChapterDto
        {
            Id = chapter.Id,
            Title = chapter.Title,
            CreationTime = chapter.CreationTime,
            CreatorId = chapter.CreatorId,
            Position = chapter.Position,
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