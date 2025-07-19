using CourseMate.Services.Dtos.Lookups;

namespace CourseMate.Services.Lookups;

public interface ILookupAppService : IApplicationService
{
    Task<PagedResultDto<LookupDto>> GetCategoriesAsync(LookupRequestDto input);
    Task<PagedResultDto<LookupDto>> GetCoursesAsync(LookupRequestDto input);
    Task<PagedResultDto<LookupDto>> GetChaptersAsync(LookupRequestDto input);
    Task<int> GetMaxPositionChaptersAsync(Guid courseId);
    Task<int> GetMaxPositionLessonsAsync(Guid chapterId);
}