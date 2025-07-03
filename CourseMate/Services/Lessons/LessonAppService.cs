using System.Linq.Dynamic.Core;
using CourseMate.Entities.Lessons;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Chapters;
using CourseMate.Services.Dtos.Lessons;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;

namespace CourseMate.Services.Lessons;

[Authorize(CourseMatePermissions.Lessons.Default)]
public class LessonAppService : CourseMateAppService, ILessonAppService
{
    public async Task<LessonDto> GetAsync(Guid id)
    {
        Lesson lesson = await LessonRepo.GetAsync(id);
        return ObjectMapper.Map<Lesson, LessonDto>(lesson);
    }

    public async Task<PagedResultDto<LessonDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        IQueryable<Lesson> queryable = await LessonRepo.GetQueryableAsync();
        IQueryable<Lesson> query = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "Name" : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        List<Lesson> lessons = await AsyncExecuter.ToListAsync(query);
        int totalCount = await AsyncExecuter.CountAsync(queryable);

        return new PagedResultDto<LessonDto>(totalCount, ObjectMapper.Map<List<Lesson>, List<LessonDto>>(lessons)
        );
    }

    [Authorize(CourseMatePermissions.Lessons.Create)]
    public async Task<LessonDto> CreateAsync(CreateUpdateChapterDto input)
    {
        Lesson lesson = ObjectMapper.Map<CreateUpdateChapterDto, Lesson>(input);
        await LessonRepo.InsertAsync(lesson);
        return ObjectMapper.Map<Lesson, LessonDto>(lesson);
    }

    [Authorize(CourseMatePermissions.Lessons.Edit)]
    public async Task<LessonDto> UpdateAsync(Guid id, CreateUpdateChapterDto input)
    {
        Lesson lesson = await LessonRepo.GetAsync(id);
        ObjectMapper.Map(input, lesson);
        await LessonRepo.UpdateAsync(lesson);
        return ObjectMapper.Map<Lesson, LessonDto>(lesson);
    }

    [Authorize(CourseMatePermissions.Lessons.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await ChapterRepo.DeleteAsync(id);
    }
}