using CourseMate.Services.Dtos.Courses;

namespace CourseMate.Services.Courses;

public interface ICourseAppService : IApplicationService
{
    Task<CourseDto> GetAsync(Guid id);
    Task<CourseDto> GetBySlugAsync(string slug);
    Task<PagedResultDto<CourseDto>> GetListAsync(GetListCourseRequestDto input);
    Task<ResultObjectDto> CreateAsync(CreateUpdateCourseDto input);
    Task<CourseDto> UpdateAsync(Guid id, CreateUpdateCourseDto input);
    Task DeleteAsync(Guid id);
}