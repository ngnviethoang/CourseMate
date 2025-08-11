using CourseMate.Entities.Courses;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Chapters;
using CourseMate.Services.Dtos.Courses;
using CourseMate.Services.Dtos.Lessons;
using CourseMate.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Validation;

namespace CourseMate.Services.Courses;

[Authorize(CourseMatePermissions.Courses.Default)]
public class CourseAppService : CourseMateAppService, ICourseAppService
{
    [AllowAnonymous]
    public async Task<CourseDto> GetAsync(Guid id)
    {
        return await GetCourseAsync(id, null);
    }

    [AllowAnonymous]
    public async Task<CourseDto> GetBySlugAsync(string slug)
    {
        return await GetCourseAsync(null, slug);
    }

    private async Task<CourseDto> GetCourseAsync(Guid? id, string? slug)
    {
        IQueryable<Course> courseQueryable = await CourseRepo.GetQueryableAsync();
        IQueryable<CourseDto> queryable = courseQueryable
            .WhereIf(id != null, i => i.Id == id)
            .WhereIf(id == null, i => i.Slug == slug)
            .Select(course => new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                ThumbnailFile = course.ThumbnailFile,
                Price = course.Price,
                Currency = course.Currency,
                LevelType = course.LevelType,
                IsActive = course.IsActive,
                InstructorId = course.InstructorId,
                CategoryId = course.CategoryId,
                Slug = course.Slug,
                CreationTime = course.CreationTime,
                CreatorId = course.CreatorId,
                LastModificationTime = course.LastModificationTime,
                LastModifierId = course.LastModifierId
            });

        CourseDto? courseDto = await AsyncExecuter.FirstOrDefaultAsync(queryable);
        if (courseDto == null)
        {
            return new CourseDto();
        }

        IQueryable<ChapterDto> queryableChapter =
            from chapter in await ChapterRepo.GetQueryableAsync()
            join lesson in await LessonRepo.GetQueryableAsync()
                on chapter.Id equals lesson.ChapterId
            where chapter.CourseId == courseDto.Id
            group lesson by chapter
            into g
            orderby g.Key.Position
            select new ChapterDto
            {
                Id = g.Key.Id,
                Title = g.Key.Title,
                Position = g.Key.Position,
                CourseId = g.Key.CourseId,
                CourseTitle = g.Key.Title,
                Lessons = g.OrderBy(i => i.Position).Select(i => new LessonDto
                {
                    Id = i.Id,
                    Title = i.Title,
                    ChapterId = i.ChapterId,
                    Content = null,
                    Duration = i.Duration,
                    VideoFile = i.VideoFile,
                    Position = i.Position,
                    CodeSampleJson = null,
                    CorrectAnswerJson = null,
                    Explanation = null,
                    OptionsJson = null,
                    Type = i.Type
                })
            };

        courseDto.Chapters = await AsyncExecuter.ToListAsync(queryableChapter);
        courseDto.IsInCart = await CartRepo.AnyAsync(i => i.Id == courseDto.Id && i.UserId == CurrentUser.Id);
        courseDto.IsEnrollment = await EnrollmentRepo.AnyAsync(i => i.CourseId == courseDto.Id && i.StudentId == CurrentUser.Id);
        return courseDto;
    }

    [AllowAnonymous]
    public async Task<PagedResultDto<CourseDto>> GetListAsync(GetListCourseRequestDto input)
    {
        IQueryable<CourseDto> queryable =
            from course in await CourseRepo.GetQueryableAsync()
            join user in await UserRepo.GetQueryableAsync()
                on course.InstructorId equals user.Id
            select new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = string.Empty,
                ThumbnailFile = course.ThumbnailFile,
                Price = course.Price,
                Currency = course.Currency,
                LevelType = course.LevelType,
                IsActive = course.IsActive,
                InstructorId = course.InstructorId,
                CategoryId = course.CategoryId,
                CreationTime = course.CreationTime,
                CreatorId = course.CreatorId,
                LastModificationTime = course.LastModificationTime,
                LastModifierId = course.LastModifierId,
                Slug = course.Slug,
                Author = new AuthorDto
                {
                    UserName = user.UserName,
                    Avatar = user.Email
                }
            };
        queryable = queryable
            .WhereIf(!string.IsNullOrEmpty(input.Filter), i => i.Title.Contains(input.Filter!))
            .WhereIf(input.CategoryId.HasValue, i => i.CategoryId == input.CategoryId!.Value)
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? nameof(Course.Title) : input.Sorting);

        if (input.SkipCount.HasValue)
        {
            queryable = queryable.Skip(input.SkipCount.Value);
        }

        if (input.MaxResultCount.HasValue)
        {
            queryable = queryable.Take(input.MaxResultCount.Value);
        }

        List<CourseDto> courses = await AsyncExecuter.ToListAsync(queryable.AsNoTracking());
        IEnumerable<Guid> courseIds = courses.Select(i => i.Id);

        var enrollmentsPerCourseQuery =
            from enrollment in await EnrollmentRepo.GetQueryableAsync()
            where courseIds.Contains(enrollment.CourseId)
            group enrollment by enrollment.CourseId
            into g
            select new { CourseId = g.Key, Count = g.Count() };
        var enrollmentsPerCourse = await AsyncExecuter.ToListAsync(enrollmentsPerCourseQuery);
        var enrollmentsPerCourseDict = enrollmentsPerCourse.ToDictionary(i => i.CourseId, i => i);

        var lessonsPerCourseQuery =
            from chapter in await ChapterRepo.GetQueryableAsync()
            join lesson in await LessonRepo.GetQueryableAsync()
                on chapter.Id equals lesson.ChapterId
            where courseIds.Contains(chapter.CourseId)
            group lesson by chapter.CourseId
            into g
            select new { CourseId = g.Key, Count = g.Count() };
        var lessonsPerCourse = await AsyncExecuter.ToListAsync(lessonsPerCourseQuery);
        var lessonsPerCourseDict = lessonsPerCourse.ToDictionary(i => i.CourseId, i => i);

        foreach (CourseDto course in courses)
        {
            enrollmentsPerCourseDict.TryGetValue(course.Id, out var totalStudents);
            course.TotalStudents = totalStudents?.Count;

            lessonsPerCourseDict.TryGetValue(course.Id, out var totalLessons);
            course.TotalLessons = totalLessons?.Count;
        }

        int totalCount = await CourseRepo.CountAsync();
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
            input.Summary,
            instructorId,
            input.CategoryId,
            Helper.GenerateSlug(input.Title),
            input.IsActive
        );
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
        course.CategoryId = input.CategoryId;
        course.IsActive = input.IsActive;
        course.Slug = Helper.GenerateSlug(input.Title);
        
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
            IsActive = course.IsActive,
            InstructorId = course.InstructorId,
            Slug = course.Slug,
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