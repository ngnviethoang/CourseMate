using System.Linq.Dynamic.Core;
using CourseMate.Entities.Courses;
using CourseMate.Permissions;
using CourseMate.Services.Dtos;
using CourseMate.Services.Dtos.Courses;
using CourseMate.Shared.Constants;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Validation;

namespace CourseMate.Services.Courses;

[Authorize(CourseMatePermissions.Courses.Default)]
public class CourseAppService : CourseMateAppService, ICourseAppService
{
    public async Task<CourseDto> GetAsync(Guid id)
    {
        var queryable =
            from course in await CourseRepo.GetQueryableAsync()
            where course.Id == id
            select new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                ThumbnailFile = course.ThumbnailFile,
                Price = course.Price,
                Currency = course.Currency,
                LevelType = course.LevelType,
                IsPublished = course.IsPublished,
                InstructorId = course.InstructorId,
                CategoryId = course.CategoryId,
                CreationTime = course.CreationTime,
                CreatorId = course.CreatorId,
                LastModificationTime = course.LastModificationTime,
                LastModifierId = course.LastModifierId
            };
        return await AsyncExecuter.FirstOrDefaultAsync(queryable) ?? new CourseDto();
    }

    public async Task<PagedResultDto<CourseDto>> GetListAsync(GetListRequestDto input)
    {
        IQueryable<CourseDto> queryable =
            from course in await CourseRepo.GetQueryableAsync()
            select new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                ThumbnailFile = course.ThumbnailFile,
                Price = course.Price,
                Currency = course.Currency,
                LevelType = course.LevelType,
                IsPublished = course.IsPublished,
                InstructorId = course.InstructorId,
                CategoryId = course.CategoryId,
                CreationTime = course.CreationTime,
                CreatorId = course.CreatorId,
                LastModificationTime = course.LastModificationTime,
                LastModifierId = course.LastModifierId
            };
        queryable = queryable.OrderBy(input.Sorting.IsNullOrWhiteSpace() ? nameof(Course.Title) : input.Sorting);

        if (input.SkipCount.HasValue)
        {
            queryable = queryable.Skip(input.SkipCount.Value);
        }

        if (input.MaxResultCount.HasValue)
        {
            queryable = queryable.Take(input.MaxResultCount.Value);
        }

        var courses = await AsyncExecuter.ToListAsync(queryable);
        int totalCount = await AsyncExecuter.CountAsync(queryable);
        return new PagedResultDto<CourseDto>(totalCount, courses);
    }

    [Authorize(CourseMatePermissions.Courses.Create)]
    public async Task<ResultObjectDto> CreateAsync(CreateUpdateCourseDto input)
    {
        bool isDuplicateTitle = await CourseRepo.AnyAsync(i => i.Title == input.Title);
        if (isDuplicateTitle)
        {
            throw new UserFriendlyException("Duplicate course title");
        }

        Guid instructorId = CurrentUser.Id!.Value;
        await CategoryRepo.EnsureExistsAsync(input.CategoryId);

        Course course = new(
            GuidGenerator.Create(),
            input.Title,
            input.Description,
            input.ThumbnailFile,
            input.Price,
            input.Currency,
            input.LevelType,
            input.IsPublished,
            instructorId,
            input.CategoryId);
        await CourseRepo.InsertAsync(course);
        return new ResultObjectDto(course.Id);
    }

    [Authorize(CourseMatePermissions.Courses.Edit)]
    public async Task<CourseDto> UpdateAsync(Guid id, CreateUpdateCourseDto input)
    {
        bool isDuplicateTitle = await CourseRepo.AnyAsync(i => i.Title == input.Title && i.Id != id);
        if (isDuplicateTitle)
        {
            throw new UserFriendlyException("Duplicate course title");
        }

        await CategoryRepo.EnsureExistsAsync(input.CategoryId);
        Course course = await CourseRepo.GetAsync(id);

        course.Title = input.Title;
        course.Description = input.Description;
        course.ThumbnailFile = input.ThumbnailFile;
        course.Price = input.Price;
        course.Currency = input.Currency;
        course.LevelType = input.LevelType;
        course.IsPublished = input.IsPublished;

        await CourseRepo.UpdateAsync(course);
        return new CourseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            ThumbnailFile = course.ThumbnailFile,
            Price = course.Price,
            Currency = course.Currency,
            LevelType = course.LevelType,
            IsPublished = course.IsPublished,
            InstructorId = course.InstructorId,
            CategoryId = course.CategoryId,
            CreationTime = course.CreationTime,
            CreatorId = course.CreatorId,
            LastModificationTime = course.LastModificationTime,
            LastModifierId = course.LastModifierId
        };
    }

    [Authorize(CourseMatePermissions.Courses.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        if (await ChapterRepo.AnyAsync(i => i.CourseId == id))
        {
            throw new AbpValidationException(ExceptionConst.InvalidRequest);
        }

        await CourseRepo.DeleteAsync(id);
    }
}