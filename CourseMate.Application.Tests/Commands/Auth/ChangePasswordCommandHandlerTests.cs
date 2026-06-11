using CourseMate.Application.Commands.Auth;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Tests.Commands.Auth;

public class ChangePasswordCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldChangePassword_WhenCorrectOldPasswordProvided()
    {
        ChangePasswordCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager);

        ChangePasswordCommand request = new()
        {
            OldPassword = "ValidPassword123!",
            NewPassword = "NewPassword456!"
        };

        await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        bool result = await _testContainer.UserManager.CheckPasswordAsync(_testContainer.TestUser, "NewPassword456!");
        Assert.True(result);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenOldPasswordIncorrect()
    {
        ChangePasswordCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager);

        ChangePasswordCommand request = new()
        {
            OldPassword = "WrongPassword123!",
            NewPassword = "NewPassword456!"
        };

        await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly User TestUser;
        public readonly Guid UserId = Guid.NewGuid();
        public readonly UserManager<User> UserManager;

        public TestContainer()
        {
            TestDbContextScope scope = new(UserId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();
            UserManager = scope.GetUserManager();

            TestUser = new User("testuser")
            {
                Id = UserId,
                Email = "test@example.com",
                EmailConfirmed = true
            };

            UserManager.CreateAsync(TestUser, "ValidPassword123!").GetAwaiter().GetResult();
        }
    }
}