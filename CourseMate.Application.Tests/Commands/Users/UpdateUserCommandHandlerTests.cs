using CourseMate.Application.Commands.Users;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Tests.Commands.Users;

public class UpdateUserCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldUpdateUser_WhenValidDataProvided()
    {
        UpdateUserAbstractCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager);

        UpdateUserCommand request = new()
        {
            Id = _testContainer.TestUser.Id,
            UserName = "updateduser",
            Email = "updated@example.com",
            PhoneNumber = "0123456789"
        };

        Unit result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(Unit.Value, result);

        User? updated = await _testContainer.UserManager.FindByIdAsync(_testContainer.TestUser.Id.ToString());
        Assert.NotNull(updated);
        Assert.Equal("updateduser", updated.UserName);
        Assert.Equal("updated@example.com", updated.Email);
        Assert.Equal("0123456789", updated.PhoneNumber);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotFound()
    {
        UpdateUserAbstractCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager);

        UpdateUserCommand request = new()
        {
            Id = Guid.NewGuid(),
            UserName = "nobody",
            Email = "nobody@example.com",
            PhoneNumber = ""
        };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly User TestUser;
        public readonly UserManager<User> UserManager;

        public TestContainer()
        {
            TestDbContextScope scope = new(Guid.NewGuid(), Roles.Admin);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();
            UserManager = scope.GetUserManager();

            TestUser = new User("originaluser") { Email = "original@example.com" };
            UserManager.CreateAsync(TestUser, "Password123!").GetAwaiter().GetResult();
        }
    }
}