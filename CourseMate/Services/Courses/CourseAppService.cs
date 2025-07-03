using System.Linq.Dynamic.Core;
using CourseMate.Entities.Courses;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Courses;
using CourseMate.Shared.Constants;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;

namespace CourseMate.Services.Courses;

[Authorize(CourseMatePermissions.Courses.Default)]
public class CourseAppService : CourseMateAppService, ICourseAppService
{
    public async Task<CourseDto> GetAsync(Guid id)
    {
        Course course = await CourseRepo.GetAsync(id);
        return ObjectMapper.Map<Course, CourseDto>(course);
    }

    public async Task<PagedResultDto<CourseDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        IQueryable<Course> queryable = await CourseRepo.GetQueryableAsync();
        IQueryable<Course> query = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "Name" : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        List<Course> courses = await AsyncExecuter.ToListAsync(query);
        int totalCount = await AsyncExecuter.CountAsync(queryable);

        return new PagedResultDto<CourseDto>(totalCount, ObjectMapper.Map<List<Course>, List<CourseDto>>(courses));
    }

    [Authorize(CourseMatePermissions.Courses.Create)]
    public async Task<CourseDto> CreateAsync(CreateUpdateCourseDto input)
    {
        await UserRepo.EnsureExistsAsync(input.InstructorId);
        await CategoryRepo.EnsureExistsAsync(input.CategoryId);
        Course course = ObjectMapper.Map<CreateUpdateCourseDto, Course>(input);
        await CourseRepo.InsertAsync(course);
        return ObjectMapper.Map<Course, CourseDto>(course);
    }

    [Authorize(CourseMatePermissions.Courses.Edit)]
    public async Task<CourseDto> UpdateAsync(Guid id, CreateUpdateCourseDto input)
    {
        Course course = await CourseRepo.GetAsync(id);
        await UserRepo.EnsureExistsAsync(input.InstructorId);
        await CategoryRepo.EnsureExistsAsync(input.CategoryId);
        ObjectMapper.Map(input, course);
        await CourseRepo.UpdateAsync(course);
        return ObjectMapper.Map<Course, CourseDto>(course);
    }

    [Authorize(CourseMatePermissions.Courses.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        if (await ChapterRepo.AnyAsync(i => i.CourseId == id))
        {
            throw new BusinessException(ExceptionConst.InvalidRequest);
        }

        await CourseRepo.DeleteAsync(id);
    }
}