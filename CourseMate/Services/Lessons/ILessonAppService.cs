using CourseMate.Services.Dtos;
using CourseMate.Services.Dtos.Lessons;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CourseMate.Services.Lessons;

public interface ILessonAppService : IApplicationService
{
    Task<LessonDto> GetAsync(Guid id);
    Task<PagedResultDto<LessonDto>> GetListAsync(PagedAndSortedResultRequestDto input);
    Task<ResultObjectDto> CreateAsync(CreateUpdateLessonDto input);
    Task<LessonDto> UpdateAsync(Guid id, CreateUpdateLessonDto input);
    Task DeleteAsync(Guid id);
}