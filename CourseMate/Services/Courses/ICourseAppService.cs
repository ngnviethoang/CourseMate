using CourseMate.Services.Dtos;
using CourseMate.Services.Dtos.Courses;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CourseMate.Services.Courses;

public interface ICourseAppService : IApplicationService
{
    Task<CourseDto> GetAsync(Guid id);
    Task<PagedResultDto<CourseDto>> GetListAsync(GetListCourseRequestDto input);
    Task<ResultObjectDto> CreateAsync(CreateUpdateCourseDto input);
    Task<CourseDto> UpdateAsync(Guid id, CreateUpdateCourseDto input);
    Task DeleteAsync(Guid id);
}