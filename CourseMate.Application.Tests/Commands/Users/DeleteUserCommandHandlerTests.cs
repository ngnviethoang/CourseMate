using CourseMate.Application.Commands.Users;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Users;

public class DeleteUserCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldDeleteUser_WhenAdminDeletesUser()
    {
        DeleteUserAbstractCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor, _testContainer.UserManager);

        DeleteUserCommand request = new() { Id = _testContainer.UserId };

        await handler.Handle(request, CancellationToken.None);

        User? deleted = await _testContainer.DbContext.Users.FirstOrDefaultAsync(u => u.Id == _testContainer.UserId);
        Assert.Null(deleted);
    }

    [Fact]
    public async Task Handle_ShouldReturnUnit_WhenUserNotFound()
    {
        DeleteUserAbstractCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor, _testContainer.UserManager);

        DeleteUserCommand request = new() { Id = Guid.NewGuid() };

        Unit result = await handler.Handle(request, CancellationToken.None);

        Assert.NotNull(result);
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

            User user = new("testuser") { Id = UserId };
            DbContext.Users.Add(user);
            DbContext.SaveChanges();
        }
    }
}