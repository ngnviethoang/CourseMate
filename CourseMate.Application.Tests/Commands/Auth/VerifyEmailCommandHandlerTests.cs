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

public class VerifyEmailCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldConfirmEmail_WhenValidTokenProvided()
    {
        string token = await _testContainer.UserManager.GenerateEmailConfirmationTokenAsync(_testContainer.TestUser);

        VerifyEmailCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager);

        VerifyEmailCommand request = new()
        {
            UserId = _testContainer.TestUser.Id,
            Token = token
        };

        Unit result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(Unit.Value, result);

        User? updatedUser = await _testContainer.UserManager.FindByIdAsync(_testContainer.TestUser.Id.ToString());
        Assert.NotNull(updatedUser);
        Assert.True(updatedUser.EmailConfirmed);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotFound()
    {
        VerifyEmailCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager);

        VerifyEmailCommand request = new()
        {
            UserId = Guid.NewGuid(),
            Token = "sometoken"
        };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenTokenIsInvalid()
    {
        VerifyEmailCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager);

        VerifyEmailCommand request = new()
        {
            UserId = _testContainer.TestUser.Id,
            Token = "invalid-token"
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

            TestUser = new User("verifyuser") { Email = "verify@example.com", EmailConfirmed = false };
            UserManager.CreateAsync(TestUser, "ValidPassword123!").GetAwaiter().GetResult();
        }
    }
}