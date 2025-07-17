using System.Text.Json;
using CourseMate.Data.Seeds.Models;
using CourseMate.Entities.Categories;
using CourseMate.Entities.Courses;
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
    private readonly IdentityRoleManager _identityRoleManager;
    private readonly PermissionManager _permissionManager;
    private readonly IdentityUserManager _identityUserManager;
    private readonly IRepository<Course, Guid> _courseRepo;
    private readonly IRepository<Category, Guid> _categoryRepo;

    public CourseMateDataSeederContributor(
        IdentityRoleManager identityRoleManager,
        PermissionManager permissionManager,
        IRepository<Category, Guid> categoryRepo,
        IRepository<Course, Guid> courseRepo,
        IdentityUserManager identityUserManager)
    {
        _identityRoleManager = identityRoleManager;
        _permissionManager = permissionManager;
        _categoryRepo = categoryRepo;
        _courseRepo = courseRepo;
        _identityUserManager = identityUserManager;
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

        if (await _categoryRepo.GetCountAsync() == 0)
        {
            string projectDomain = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Seeds");
            string jsonFilePath = Path.Combine(projectDomain, "categories.json");
            string json = await File.ReadAllTextAsync(jsonFilePath);
            List<CategoryModel>? categoryModels = JsonSerializer.Deserialize<List<CategoryModel>>(json);

            Dictionary<int, Guid> categoryDict = new();


            if (categoryModels != null)
            {
                List<Category> categories = [];
                foreach (CategoryModel model in categoryModels)
                {
                    Guid newId = Guid.NewGuid();
                    categoryDict[model.Id] = newId;

                    categories.Add(new Category(newId, model.Name ?? $"Name + {Guid.NewGuid()}", model.Description ?? $"Description + {Guid.NewGuid()}"));
                }

                await _categoryRepo.InsertManyAsync(categories, true);
            }

            if (await _courseRepo.GetCountAsync() == 0)
            {
                jsonFilePath = Path.Combine(projectDomain, "courses.json");
                json = await File.ReadAllTextAsync(jsonFilePath);
                List<CourseModel>? courseModels = JsonSerializer.Deserialize<List<CourseModel>>(json);
                if (courseModels != null)
                {
                    List<Course> courses = [];
                    Random random = new();
                    IdentityUser? adminUser = await _identityUserManager.FindByNameAsync("admin");
                    foreach (CourseModel model in courseModels)
                    {
                        Guid categoryId;
                        categoryId = categoryDict.TryGetValue(model.CategoryId, out categoryId) ? categoryId : categoryDict.First().Value;
                        courses.Add(new Course(
                            Guid.NewGuid(),
                            model.Title ?? $"Title + {Guid.NewGuid()}",
                            model.Summary ?? $"Summary + {Guid.NewGuid()}",
                            model.Thumbnail ?? string.Empty,
                            model.Price,
                            CurrencyType.Vnd,
                            (LevelType)random.Next(1, 4),
                            true,
                            adminUser!.Id,
                            categoryId));
                    }

                    await _courseRepo.InsertManyAsync(courses, true);
                }
            }
        }

        #endregion
    }
}