using CourseMate.Application.Commands.Users;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Tests.Commands.Users;

public class CreateUserCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldCreateUser_WhenAdminCreatesUser()
    {
        CreateUserCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager,
            _testContainer.RoleManager);

        CreateUserCommand request = new()
        {
            UserName = "newuser",
            Email = "newuser@example.com",
            Password = "Password123!",
            Role = "Student"
        };

        ResultIdDto result = await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        User? created = await _testContainer.UserManager.FindByEmailAsync("newuser@example.com");
        Assert.NotNull(created);
        Assert.Equal("newuser", created.UserName);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenEmailAlreadyExists()
    {
        CreateUserCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager,
            _testContainer.RoleManager);

        CreateUserCommand request = new()
        {
            UserName = "anotheruser",
            Email = "existing@example.com",
            Password = "Password123!",
            Role = "Student"
        };

        await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly RoleManager<IdentityRole<Guid>> RoleManager;
        public readonly UserManager<User> UserManager;

        public TestContainer()
        {
            TestDbContextScope scope = new(Guid.NewGuid(), Roles.Admin);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();
            UserManager = scope.GetUserManager();
            RoleManager = scope.GetRoleManager();

            User existingUser = new("existing")
            {
                Email = "existing@example.com"
            };

            UserManager.CreateAsync(existingUser, "Password123!").GetAwaiter().GetResult();
        }
    }
}