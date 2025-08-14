using CourseMate.Services.Dtos.Lessons;

namespace CourseMate.Services.Lessons;

public interface ILessonAppService : IApplicationService
{
    Task<LessonDto> GetAsync(Guid id);
    Task<PagedResultDto<LessonDto>> GetListAsync(GetListLessonRequestDto input);
    Task<ResultObjectDto> CreateAsync(CreateUpdateLessonDto input);
    Task<LessonDto> UpdateAsync(Guid id, CreateUpdateLessonDto input);
    Task DeleteAsync(Guid id);
}