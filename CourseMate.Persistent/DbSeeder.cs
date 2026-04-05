using System.Text.Json;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace CourseMate.Persistent;

public static class DbSeeder
{
    public static async Task SeedAsync(this IServiceProvider services)
    {
        using IServiceScope scope = services.CreateScope();
        RoleManager<IdentityRole<Guid>> roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        UserManager<IdentityUser<Guid>> userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser<Guid>>>();
        CourseMateDbContext dbContext = scope.ServiceProvider.GetRequiredService<CourseMateDbContext>();

        IReadOnlyList<string> roles = [Roles.Admin, Roles.Instructor, Roles.Student, Roles.PendingInstructor];
        foreach (string role in roles)
        {
            await roleManager.CreateAsync(new IdentityRole<Guid>(role));
        }

        IReadOnlyDictionary<string, string> userRoleDict = new Dictionary<string, string>
        {
            ["admin"] = Roles.Admin,
            ["manager"] = Roles.Admin,
            ["instructor1"] = Roles.Instructor,
            ["instructor2"] = Roles.Instructor,
            ["instructor3"] = Roles.Instructor,
            ["student1"] = Roles.Student,
            ["student2"] = Roles.Student,
            ["student3"] = Roles.Student
        };
        List<Guid> instructorIds = [];
        foreach (KeyValuePair<string, string> userRole in userRoleDict)
        {
            IdentityUser<Guid> user = new() { UserName = userRole.Key, Email = $"{userRole.Key}@example.com", EmailConfirmed = true };
            await userManager.CreateAsync(user, "User@123");
            await userManager.AddToRoleAsync(user, userRole.Value);
            if (string.Equals(Roles.Instructor, userRole.Value))
            {
                instructorIds.Add(user.Id);
            }
        }

        string projectDomain = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory())!.Parent!.FullName, "Seeds");
        string jsonFilePath = Path.Combine(projectDomain, "categories.json");
        string json = await File.ReadAllTextAsync(jsonFilePath);

        List<Category> categories = JsonSerializer.Deserialize<List<Category>>(json)!;
        categories.ForEach(i => i.IsActive = true);
        await dbContext.Categories.AddRangeAsync(categories);

        Random random = new();
        jsonFilePath = Path.Combine(projectDomain, "courses.json");
        json = await File.ReadAllTextAsync(jsonFilePath);
        List<Course> courses = JsonSerializer.Deserialize<List<Course>>(json)!;
        foreach (Course i in courses)
        {
            i.InstructorId = instructorIds.ElementAtOrDefault(random.Next(instructorIds.Count));
        }

        await dbContext.Courses.AddRangeAsync(courses);
        jsonFilePath = Path.Combine(projectDomain, "chapters.json");
        json = await File.ReadAllTextAsync(jsonFilePath);
        List<Chapter> chapters = JsonSerializer.Deserialize<List<Chapter>>(json)!;
        Dictionary<Guid, Guid> chapterDict = chapters.ToDictionary(i => i.Id, i => i.CourseId);
        await dbContext.Chapters.AddRangeAsync(chapters);

        jsonFilePath = Path.Combine(projectDomain, "lessons.json");
        json = await File.ReadAllTextAsync(jsonFilePath);
        List<Lesson> lessons = JsonSerializer.Deserialize<List<Lesson>>(json)!;
        lessons.ForEach(i =>
        {
            if (chapterDict.TryGetValue(i.ChapterId, out Guid courseId))
            {
                i.CourseId = courseId;
            }
        });
        await dbContext.Lessons.AddRangeAsync(lessons);
        await dbContext.SaveChangesAsync();
    }
}