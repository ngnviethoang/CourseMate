using CourseMate.Contracts.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace CourseMate.Infrastructure;

public static class DbSeeder
{
    public static async Task SeedAsync(this IServiceProvider services)
    {
        using IServiceScope scope = services.CreateScope();
        RoleManager<IdentityRole<Guid>> roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        UserManager<IdentityUser<Guid>> userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser<Guid>>>();

        string[] roles = [Roles.Admin, Roles.Instructor, Roles.Student];
        foreach (string role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }

        if (await userManager.FindByNameAsync("admin") == null)
        {
            IdentityUser<Guid> admin = new() { UserName = "admin", Email = "admin@example.com", EmailConfirmed = true };
            await userManager.CreateAsync(admin, "Admin@123");
            await userManager.AddToRoleAsync(admin, Roles.Admin);
        }

        if (await userManager.FindByNameAsync("instructor") == null)
        {
            IdentityUser<Guid> instructor = new() { UserName = "instructor", Email = "instructor@example.com", EmailConfirmed = true };
            await userManager.CreateAsync(instructor, "Instructor@123");
            await userManager.AddToRoleAsync(instructor, Roles.Instructor);
        }

        if (await userManager.FindByNameAsync("student") == null)
        {
            IdentityUser<Guid> student = new() { UserName = "student", Email = "student@example.com", EmailConfirmed = true };
            await userManager.CreateAsync(student, "Student@123");
            await userManager.AddToRoleAsync(student, Roles.Student);
        }
    }
}