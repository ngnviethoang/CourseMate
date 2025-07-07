using CourseMate.Permissions;
using CourseMate.Shared.Constants;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace CourseMate.Data;

public class CourseMateDataSeederContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IdentityRoleManager _identityRoleManager;
    private readonly PermissionManager _permissionManager;

    public CourseMateDataSeederContributor(IdentityRoleManager identityRoleManager, PermissionManager permissionManager)
    {
        _identityRoleManager = identityRoleManager;
        _permissionManager = permissionManager;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        List<PermissionWithGrantedProviders> permissions = await _permissionManager.GetAllAsync(null, null) ?? [];
        if (!await _identityRoleManager.RoleExistsAsync(RoleConst.Anonymous))
        {
            IdentityRole role = new(Guid.NewGuid(), RoleConst.Anonymous)
            {
                IsDefault = true,
                IsPublic = true,
                IsStatic = true
            };
            await _identityRoleManager.CreateAsync(role);

            foreach (PermissionWithGrantedProviders permission in permissions.Where(i => i.Name.StartsWith(CourseMatePermissions.GroupName)))
            {
                await _permissionManager.SetForRoleAsync(RoleConst.Anonymous, permission.Name, true);
            }
        }

        if (!await _identityRoleManager.RoleExistsAsync(RoleConst.Student))
        {
            IdentityRole role = new(Guid.NewGuid(), RoleConst.Student)
            {
                IsDefault = false,
                IsPublic = true,
                IsStatic = true
            };
            await _identityRoleManager.CreateAsync(role);

            foreach (PermissionWithGrantedProviders permission in permissions.Where(i => i.Name.StartsWith(CourseMatePermissions.GroupName)))
            {
                await _permissionManager.SetForRoleAsync(RoleConst.Student, permission.Name, true);
            }
        }

        if (!await _identityRoleManager.RoleExistsAsync(RoleConst.Instructor))
        {
            IdentityRole role = new(Guid.NewGuid(), RoleConst.Instructor)
            {
                IsDefault = false,
                IsPublic = true,
                IsStatic = true
            };
            await _identityRoleManager.CreateAsync(role);
            foreach (PermissionWithGrantedProviders permission in permissions.Where(i => i.Name.StartsWith(CourseMatePermissions.GroupName)))
            {
                await _permissionManager.SetForRoleAsync(RoleConst.Student, permission.Name, true);
            }
        }
    }
}