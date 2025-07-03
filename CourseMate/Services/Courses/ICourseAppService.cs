using CourseMate.Services.Dtos.Courses;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CourseMate.Services.Courses;

public interface ICourseAppService : ICrudAppService<CourseDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateCourseDto>;