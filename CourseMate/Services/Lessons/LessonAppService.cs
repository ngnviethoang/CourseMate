using CourseMate.Entities.Lessons;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Lessons;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;

namespace CourseMate.Services.Lessons;

[Authorize(CourseMatePermissions.Lessons.Default)]
public class LessonAppService : CourseMateAppService, ILessonAppService
{
    public async Task<LessonDto> GetAsync(Guid id)
    {
        IQueryable<LessonDto> queryable =
            from lesson in await LessonRepo.GetQueryableAsync()
            join chapter in await ChapterRepo.GetQueryableAsync()
                on lesson.ChapterId equals chapter.Id
            join course in await CourseRepo.GetQueryableAsync()
                on chapter.CourseId equals course.Id
            where lesson.Id == id
            select new LessonDto
            {
                Id = lesson.Id,
                Title = lesson.Title,
                ChapterId = lesson.ChapterId,
                Content = lesson.Content,
                Duration = lesson.Duration,
                VideoFile = lesson.VideoFile,
                Position = lesson.Position,
                CreationTime = lesson.CreationTime,
                CreatorId = lesson.CreatorId,
                LastModificationTime = lesson.LastModificationTime,
                LastModifierId = lesson.LastModifierId,
                Type = lesson.Type,
                CodeSampleJson = lesson.CodeSampleJson,
                CorrectAnswerJson = lesson.CorrectAnswerJson,
                Explanation = lesson.Explanation,
                OptionsJson = lesson.OptionsJson,
                CourseId = course.Id
            };
        return await AsyncExecuter.FirstOrDefaultAsync(queryable) ?? new LessonDto();
    }

    public async Task<PagedResultDto<LessonDto>> GetListAsync(GetListLessonRequestDto input)
    {
        IQueryable<LessonDto> queryable =
            from lesson in await LessonRepo.GetQueryableAsync()
            select new LessonDto
            {
                Id = lesson.Id,
                Title = lesson.Title,
                ChapterId = lesson.ChapterId,
                Content = lesson.Content,
                Duration = lesson.Duration,
                VideoFile = lesson.VideoFile,
                Position = lesson.Position,
                CreationTime = lesson.CreationTime,
                CreatorId = lesson.CreatorId,
                LastModificationTime = lesson.LastModificationTime,
                LastModifierId = lesson.LastModifierId,
                Type = lesson.Type,
                CodeSampleJson = lesson.CodeSampleJson,
                CorrectAnswerJson = lesson.CorrectAnswerJson,
                Explanation = lesson.Explanation,
                OptionsJson = lesson.OptionsJson
            };
        queryable = queryable
            .WhereIf(input.ChapterId != null, lesson => lesson.ChapterId == input.ChapterId)
            .WhereIf(!string.IsNullOrEmpty(input.Filter), i => i.Title.Contains(input.Filter!))
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? nameof(Lesson.Title) : input.Sorting);

        if (input.SkipCount.HasValue)
        {
            queryable = queryable.Skip(input.SkipCount.Value);
        }

        if (input.MaxResultCount.HasValue)
        {
            queryable = queryable.Take(input.MaxResultCount.Value);
        }

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

        await ChapterRepo.EnsureExistsAsync(input.ChapterId);

        Lesson lesson = new(
            Guid.NewGuid(),
            LessonType.Video,
            input.ChapterId,
            input.Position,
            input.Title,
            input.Content,
            input.VideoFile,
            input.Duration
        );

        await LessonRepo.InsertAsync(lesson);

        List<Lesson> lessons = await LessonRepo.GetListAsync(i => i.ChapterId == lesson.ChapterId && i.Position == lesson.Position);
        lessons.ForEach(i => i.Position = 0);
        await LessonRepo.UpdateManyAsync(lessons);

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

        await ChapterRepo.EnsureExistsAsync(input.ChapterId);
        Lesson lesson = await LessonRepo.GetAsync(id);

        lesson.Title = input.Title;
        lesson.Content = input.Content;
        lesson.VideoFile = input.VideoFile;
        lesson.Duration = input.Duration;
        lesson.ChapterId = input.ChapterId;
        await LessonRepo.UpdateAsync(lesson);

        List<Lesson> lessons = await LessonRepo.GetListAsync(i => i.ChapterId == lesson.ChapterId && i.Position == lesson.Position);
        lessons.ForEach(i => i.Position = 0);
        await LessonRepo.UpdateManyAsync(lessons);

        return new LessonDto
        {
            Id = lesson.Id,
            Title = lesson.Title,
            ChapterId = lesson.ChapterId,
            Content = lesson.Content,
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