using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using IdentityRole = Volo.Abp.Identity.IdentityRole;
using IdentityUser = Volo.Abp.Identity.IdentityUser;

namespace CourseMate.Services.Users;

[Dependency(ReplaceServices = true)]
[ExposeServices(typeof(IIdentityUserAppService), typeof(IdentityUserAppService), typeof(UserAppService))]
[Authorize]
public class UserAppService : IdentityUserAppService, IUserAppService
{
    public UserAppService(
        IdentityUserManager userManager,
        IIdentityUserRepository userRepository,
        IIdentityRoleRepository roleRepository,
        IOptions<IdentityOptions> identityOptions,
        IPermissionChecker permissionChecker) : base(userManager, userRepository, roleRepository, identityOptions, permissionChecker)
    {
    }

    public async Task<PagedResultDto<IdentityUserDto>> GetListStudentAsync(GetIdentityUsersInput input)
    {
        return await GetUsersByRoleNameAsync(input, RoleConst.Student);
    }

    public async Task<PagedResultDto<IdentityUserDto>> GetListInstructorAsync(GetIdentityUsersInput input)
    {
        return await GetUsersByRoleNameAsync(input, RoleConst.Instructor);
    }

    private async Task<PagedResultDto<IdentityUserDto>> GetUsersByRoleNameAsync(GetIdentityUsersInput input, string roleName)
    {
        string normalizedRoleName = roleName.ToUpper();
        IdentityRole? role = await RoleRepository.FindByNormalizedNameAsync(normalizedRoleName);
        if (role == null)
        {
            return new PagedResultDto<IdentityUserDto>();
        }

        long count = await UserRepository.GetCountAsync(input.Filter, role.Id);
        List<IdentityUser>? users = await UserRepository.GetListAsync(input.Sorting, input.MaxResultCount, input.SkipCount, input.Filter, roleId: role.Id);
        return new PagedResultDto<IdentityUserDto>(count, ObjectMapper.Map<List<IdentityUser>, List<IdentityUserDto>>(users));
    }
}