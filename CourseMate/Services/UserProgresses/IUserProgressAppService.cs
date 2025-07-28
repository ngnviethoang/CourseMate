using CourseMate.Services.Dtos.UserProgresses;

namespace CourseMate.Services.UserProgresses;

public interface IUserProgressAppService : IApplicationService
{
    Task<CourseProgressDto> GetAsync(Guid courseId);
    Task UpdateAsync(CreateUpdateUserProgressDto input);
}