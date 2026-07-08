using CourseMate.Application.Queries.Categories;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Categories;

public class GetCategoryByIdQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnCategory_WhenFound()
    {
        Guid categoryId = _testContainer.ExistingCategoryId;
        GetCategoryByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        CategoryDto? result = await handler.Handle(new GetCategoryByIdQuery { Id = categoryId }, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(categoryId, result.Id);
        Assert.Equal("Security", result.Name);
    }

    [Fact]
    public async Task Handle_ShouldReturnNull_WhenCategoryDoesNotExist()
    {
        GetCategoryByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        CategoryDto? result = await handler.Handle(new GetCategoryByIdQuery { Id = Guid.NewGuid() }, CancellationToken.None);

        Assert.Null(result);
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly Guid ExistingCategoryId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Admin);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();
            ReadOnlyDbContext = testDbContextScope.CreateReadOnlyDbContext();
            DbContext.Categories.Add(new Category(ExistingCategoryId, "Security", "Security courses", true));
            DbContext.SaveChanges();
        }
    }
}