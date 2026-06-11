using CourseMate.Application.Queries.Users;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Users;

public class GetUserByIdQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnUser_WhenUserExists()
    {
        GetUserByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetUserByIdQuery query = new() { Id = _testContainer.UserId };

        UserDto? result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("testuser", result.UserName);
    }

    [Fact]
    public async Task Handle_ShouldReturnNull_WhenUserNotFound()
    {
        GetUserByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetUserByIdQuery query = new() { Id = Guid.NewGuid() };

        UserDto? result = await handler.Handle(query, CancellationToken.None);

        Assert.Null(result);
    }

    private sealed class TestContainer
    {
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(Guid.NewGuid(), Roles.Admin);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            User user = new("testuser") { Id = UserId };
            dbContext.Users.Add(user);
            dbContext.SaveChanges();
        }
    }
}