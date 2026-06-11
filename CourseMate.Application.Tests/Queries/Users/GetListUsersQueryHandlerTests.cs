using CourseMate.Application.Queries.Users;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Users;

public class GetListUsersQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnAllUsers_WhenNoFilterApplied()
    {
        GetListUsersQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetListUsersQuery query = new();

        PagedDto<UserDto> result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.True(result.TotalCount >= 2);
    }

    [Fact]
    public async Task Handle_ShouldReturnUser_WhenFilteredByGuid()
    {
        GetListUsersQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetListUsersQuery query = new() { Filter = _testContainer.StudentId.ToString() };

        PagedDto<UserDto> result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Single(result.Items);
        Assert.Equal(_testContainer.StudentId, result.Items.First().Id);
    }

    [Fact]
    public async Task Handle_ShouldReturnEmptyList_WhenFilteredByNonExistentGuid()
    {
        GetListUsersQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetListUsersQuery query = new() { Filter = Guid.NewGuid().ToString() };

        PagedDto<UserDto> result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Empty(result.Items);
    }

    [Fact]
    public async Task Handle_ShouldReturnPaginatedUsers_WithPageSize()
    {
        GetListUsersQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetListUsersQuery query = new() { PageIndex = 0, PageSize = 1 };

        PagedDto<UserDto> result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Single(result.Items);
        Assert.True(result.TotalCount >= 2);
    }

    private sealed class TestContainer
    {
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorId = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid StudentId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(Guid.NewGuid(), Roles.Admin);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            dbContext.Users.Add(new User("student1") { Id = StudentId, Email = "student1@example.com" });
            dbContext.Users.Add(new User("instructor1") { Id = InstructorId, Email = "instructor1@example.com" });

            dbContext.SaveChanges();
        }
    }
}