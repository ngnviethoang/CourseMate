using CourseMate.Application.Commands.Auth;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace CourseMate.Application.Tests.Commands.Auth;

public class RegisterCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    public RegisterCommandHandlerTests()
    {
        HangfireTestSetup.Initialize();
    }

    [Fact]
    public async Task Handle_ShouldCreateStudentUser_WhenValidStudentRegisterCommandProvided()
    {
        RegisterCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager,
            _testContainer.UserStore,
            _testContainer.RoleManager,
            _testContainer.Configuration);

        RegisterCommand request = new()
        {
            Email = "student@example.com",
            UserName = "studentuser",
            Password = "ValidPassword123!",
            Role = RegisterRole.Student
        };

        await handler.Handle(request, CancellationToken.None);

        User? createdUser = await _testContainer.UserManager.FindByEmailAsync("student@example.com");
        Assert.NotNull(createdUser);
        Assert.Equal("studentuser", createdUser.UserName);
        Assert.True(createdUser.IsApproved);
    }

    [Fact]
    public async Task Handle_ShouldCreateInstructorUser_WithPendingApproval()
    {
        RegisterCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager,
            _testContainer.UserStore,
            _testContainer.RoleManager,
            _testContainer.Configuration);

        RegisterCommand request = new()
        {
            Email = "instructor@example.com",
            UserName = "instructoruser",
            Password = "ValidPassword123!",
            Role = RegisterRole.Instructor
        };

        await handler.Handle(request, CancellationToken.None);

        User? createdUser = await _testContainer.UserManager.FindByEmailAsync("instructor@example.com");
        Assert.NotNull(createdUser);
        Assert.False(createdUser.IsApproved);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenRoleDoesNotExist()
    {
        RegisterCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager,
            _testContainer.UserStore,
            _testContainer.RoleManager,
            _testContainer.Configuration);

        RegisterCommand request = new()
        {
            Email = "test@example.com",
            UserName = "testuser",
            Password = "ValidPassword123!",
            Role = (RegisterRole)999
        };

        await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenEmailAlreadyRegistered()
    {
        User existingUser = new("existing") { Email = "existing@example.com" };
        await _testContainer.UserManager.CreateAsync(existingUser, "ValidPassword123!");

        RegisterCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager,
            _testContainer.UserStore,
            _testContainer.RoleManager,
            _testContainer.Configuration);

        RegisterCommand request = new()
        {
            Email = "existing@example.com",
            UserName = "newuser",
            Password = "ValidPassword123!",
            Role = RegisterRole.Student
        };

        await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly IConfiguration Configuration;
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly RoleManager<IdentityRole<Guid>> RoleManager;
        public readonly UserManager<User> UserManager;
        public readonly IUserStore<User> UserStore;

        public TestContainer()
        {
            TestDbContextScope scope = new(Guid.NewGuid(), Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();
            UserManager = scope.GetUserManager();
            UserStore = scope.GetUserStore();
            RoleManager = scope.GetRoleManager();
            Configuration = scope.GetConfiguration();
        }
    }
}