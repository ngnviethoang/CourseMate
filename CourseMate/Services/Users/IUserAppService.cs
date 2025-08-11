using Volo.Abp.Identity;

namespace CourseMate.Services.Users;

public interface IUserAppService : IApplicationService
{
    Task<PagedResultDto<IdentityUserDto>> GetListStudentAsync(GetIdentityUsersInput input);
    Task<PagedResultDto<IdentityUserDto>> GetListInstructorAsync(GetIdentityUsersInput input);
}