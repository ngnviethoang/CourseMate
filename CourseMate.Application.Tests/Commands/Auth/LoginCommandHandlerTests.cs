using CourseMate.Application.Commands.Auth;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace CourseMate.Application.Tests.Commands.Auth;

public class LoginCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnAccessToken_WhenValidCredentialsProvided()
    {
        LoginCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.SignInManager,
            _testContainer.Configuration,
            _testContainer.UserManager);

        LoginCommand request = new()
        {
            UserName = _testContainer.TestUser.UserName ?? string.Empty,
            Password = "ValidPassword123!"
        };

        LoginResponse result = await handler.Handle(request, CancellationToken.None);

        Assert.NotNull(result);
        Assert.NotEmpty(result.AccessToken);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenUserNotFound()
    {
        LoginCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.SignInManager,
            _testContainer.Configuration,
            _testContainer.UserManager);

        LoginCommand request = new()
        {
            UserName = "nonexistent@example.com",
            Password = "AnyPassword123!"
        };

        BusinessException exception = await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));

        Assert.Equal(ErrorCode.InvalidUsernameOrPassword, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenEmailNotVerified()
    {
        User unverifiedUser = new("unverified")
        {
            Email = "unverified@example.com",
            EmailConfirmed = false
        };

        await _testContainer.UserManager.CreateAsync(unverifiedUser, "ValidPassword123!");

        LoginCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.SignInManager,
            _testContainer.Configuration,
            _testContainer.UserManager);

        LoginCommand request = new()
        {
            UserName = "unverified",
            Password = "ValidPassword123!"
        };

        BusinessException exception = await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));

        Assert.Equal(ErrorCode.EmailNotVerified, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenAccountNotApproved()
    {
        User unapprovedUser = new("unapproved")
        {
            Email = "unapproved@example.com",
            EmailConfirmed = true,
            IsApproved = false
        };

        await _testContainer.UserManager.CreateAsync(unapprovedUser, "ValidPassword123!");

        LoginCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.SignInManager,
            _testContainer.Configuration,
            _testContainer.UserManager);

        LoginCommand request = new()
        {
            UserName = "unapproved",
            Password = "ValidPassword123!"
        };

        BusinessException exception = await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));

        Assert.Equal(ErrorCode.AccountPendingApproval, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_ShouldAcceptEmailAsUsername_WhenEmailIsProvidedInstead()
    {
        LoginCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.SignInManager,
            _testContainer.Configuration,
            _testContainer.UserManager);

        LoginCommand request = new()
        {
            UserName = _testContainer.TestUser.Email,
            Password = "ValidPassword123!"
        };

        LoginResponse result = await handler.Handle(request, CancellationToken.None);

        Assert.NotNull(result);
        Assert.NotEmpty(result.AccessToken);
    }

    private sealed class TestContainer
    {
        public readonly IConfiguration Configuration;
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly SignInManager<User> SignInManager;
        public readonly User TestUser;
        public readonly UserManager<User> UserManager;

        public TestContainer()
        {
            Guid userId = Guid.NewGuid();
            TestDbContextScope scope = new(userId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();
            UserManager = scope.GetUserManager();
            SignInManager = scope.GetSignInManager();
            Configuration = scope.GetConfiguration();

            TestUser = new User("testuser")
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                EmailConfirmed = true,
                IsApproved = true
            };

            UserManager.CreateAsync(TestUser, "ValidPassword123!").GetAwaiter().GetResult();
        }
    }
}