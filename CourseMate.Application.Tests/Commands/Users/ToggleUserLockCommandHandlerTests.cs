using CourseMate.Application.Commands.Users;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Users;

public class ToggleUserLockCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldLockUser_WhenUserIsActive()
    {
        ToggleUserLockCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor, _testContainer.UserManager);

        ToggleUserLockCommand request = new() { UserId = _testContainer.UserId };

        await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        User? locked = await _testContainer.DbContext.Users.FirstOrDefaultAsync(u => u.Id == _testContainer.UserId);

        Assert.NotNull(locked);
        Assert.NotNull(locked.LockoutEnd);
    }

    [Fact]
    public async Task Handle_ShouldUnlockUser_WhenUserIsLocked()
    {
        User lockedUser = new("lockeduser")
        {
            Email = "locked@example.com",
            LockoutEnabled = true,
            LockoutEnd = DateTimeOffset.UtcNow.AddDays(1)
        };

        await _testContainer.UserManager.CreateAsync(lockedUser);

        ToggleUserLockCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor, _testContainer.UserManager);

        ToggleUserLockCommand request = new() { UserId = lockedUser.Id };

        await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        User? unlocked = await _testContainer.DbContext.Users.FirstOrDefaultAsync(u => u.Id == lockedUser.Id);

        Assert.NotNull(unlocked);
        Assert.Null(unlocked.LockoutEnd);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotFound()
    {
        ToggleUserLockCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor, _testContainer.UserManager);

        ToggleUserLockCommand request = new() { UserId = Guid.NewGuid() };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid UserId = Guid.NewGuid();
        public readonly UserManager<User> UserManager;

        public TestContainer()
        {
            TestDbContextScope scope = new(Guid.NewGuid(), Roles.Admin);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();
            UserManager = scope.GetUserManager();

            User user = new("testuser")
            {
                Id = UserId,
                Email = "test@example.com",
                LockoutEnabled = true
            };

            UserManager.CreateAsync(user).GetAwaiter().GetResult();
        }
    }
}