using CourseMate.Entities.Books;
using CourseMate.Permissions;
using CourseMate.Shared.Constants;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace CourseMate.Data;

public class CourseMateDataSeederContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<Book, Guid> _bookRepository;
    private readonly IdentityRoleManager _identityRoleManager;
    private readonly PermissionManager _permissionManager;

    public CourseMateDataSeederContributor(IRepository<Book, Guid> bookRepository, IdentityRoleManager identityRoleManager, PermissionManager permissionManager)
    {
        _bookRepository = bookRepository;
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

        if (await _bookRepository.GetCountAsync() <= 0)
        {
            await _bookRepository.InsertAsync(
                new Book
                {
                    Name = "1984",
                    Type = BookType.Dystopia,
                    PublishDate = new DateTime(1949, 6, 8),
                    Price = 19.84f
                },
                true
            );

            await _bookRepository.InsertAsync(
                new Book
                {
                    Name = "The Hitchhiker's Guide to the Galaxy",
                    Type = BookType.ScienceFiction,
                    PublishDate = new DateTime(1995, 9, 27),
                    Price = 42.0f
                },
                true
            );
        }
    }
}