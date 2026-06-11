using CourseMate.Application.Queries.Auth;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Auth;

public class GetProfileQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnUserProfile_WhenUserIsAuthenticated()
    {
        GetProfileQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetProfileQuery query = new();

        ProfileDto? result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(_testContainer.UserId, result.Id);
        Assert.Equal("testuser", result.UserName);
    }

    private sealed class TestContainer
    {
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(UserId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            User user = new("testuser") { Id = UserId, Email = "test@example.com" };
            dbContext.Users.Add(user);
            dbContext.SaveChanges();
        }
    }
}