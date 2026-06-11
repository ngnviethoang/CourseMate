using CourseMate.Application.Commands.Auth;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Tests.Commands.Auth;

public class ResetPasswordCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldResetPassword_WhenValidTokenProvided()
    {
        string token = await _testContainer.UserManager.GeneratePasswordResetTokenAsync(_testContainer.TestUser);

        ResetPasswordCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager);

        ResetPasswordCommand request = new()
        {
            Email = "user@example.com",
            Token = token,
            NewPassword = "NewValidPassword123!"
        };

        Unit result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(Unit.Value, result);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenUserNotFound()
    {
        ResetPasswordCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager);

        ResetPasswordCommand request = new()
        {
            Email = "nobody@example.com",
            Token = "sometoken",
            NewPassword = "NewValidPassword123!"
        };

        await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenTokenIsInvalid()
    {
        ResetPasswordCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager);

        ResetPasswordCommand request = new()
        {
            Email = "user@example.com",
            Token = "invalid-token",
            NewPassword = "NewValidPassword123!"
        };

        await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly User TestUser;
        public readonly UserManager<User> UserManager;

        public TestContainer()
        {
            TestDbContextScope scope = new(Guid.NewGuid(), Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();
            UserManager = scope.GetUserManager();

            TestUser = new User("testuser") { Email = "user@example.com" };
            UserManager.CreateAsync(TestUser, "OldPassword123!").GetAwaiter().GetResult();
        }
    }
}