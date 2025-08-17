using System.Text.Json;
using CourseMate.Entities.Categories;
using CourseMate.Entities.Chapters;
using CourseMate.Entities.Courses;
using CourseMate.Entities.Lessons;
using CourseMate.Permissions;
using CourseMate.Shared;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace CourseMate.Data;

public class CourseMateDataSeederContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<Category, Guid> _categoryRepo;
    private readonly IRepository<Chapter, Guid> _chapterRepo;
    private readonly IRepository<Course, Guid> _courseRepo;
    private readonly IdentityRoleManager _identityRoleManager;
    private readonly IdentityUserManager _identityUserManager;
    private readonly IRepository<Lesson, Guid> _lessonRepo;
    private readonly PermissionManager _permissionManager;

    public CourseMateDataSeederContributor(
        IdentityRoleManager identityRoleManager,
        PermissionManager permissionManager,
        IRepository<Category, Guid> categoryRepo,
        IRepository<Course, Guid> courseRepo,
        IdentityUserManager identityUserManager,
        IRepository<Lesson, Guid> lessonRepo,
        IRepository<Chapter, Guid> chapterRepo)
    {
        _identityRoleManager = identityRoleManager;
        _permissionManager = permissionManager;
        _categoryRepo = categoryRepo;
        _courseRepo = courseRepo;
        _identityUserManager = identityUserManager;
        _lessonRepo = lessonRepo;
        _chapterRepo = chapterRepo;
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

        #region Seed category, course

        string projectDomain = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Seeds");
        string jsonFilePath;
        string json;

        if (await _categoryRepo.GetCountAsync() == 0)
        {
            jsonFilePath = Path.Combine(projectDomain, "categories.json");
            json = await File.ReadAllTextAsync(jsonFilePath);
            List<Category> categories = JsonSerializer.Deserialize<List<Category>>(json)!;
            await _categoryRepo.InsertManyAsync(categories, true);
        }

        if (await _courseRepo.GetCountAsync() == 0)
        {
            jsonFilePath = Path.Combine(projectDomain, "courses.json");
            json = await File.ReadAllTextAsync(jsonFilePath);
            List<Course> courses = JsonSerializer.Deserialize<List<Course>>(json)!;
            IdentityUser? adminUser = await _identityUserManager.FindByNameAsync("admin");
            courses.ForEach(i =>
            {
                i.InstructorId = adminUser!.Id;
                i.Slug = Helper.GenerateSlug(i.Title);
            });
            await _courseRepo.InsertManyAsync(courses, true);
        }

        if (await _chapterRepo.GetCountAsync() == 0)
        {
            jsonFilePath = Path.Combine(projectDomain, "chapters.json");
            json = await File.ReadAllTextAsync(jsonFilePath);
            List<Chapter> chapters = JsonSerializer.Deserialize<List<Chapter>>(json)!;
            await _chapterRepo.InsertManyAsync(chapters, true);
        }

        if (await _lessonRepo.GetCountAsync() == 0)
        {
            jsonFilePath = Path.Combine(projectDomain, "lessons.json");
            json = await File.ReadAllTextAsync(jsonFilePath);
            List<Lesson> lessons = JsonSerializer.Deserialize<List<Lesson>>(json)!;
            await _lessonRepo.InsertManyAsync(lessons, true);
        }

        #endregion
    }
}