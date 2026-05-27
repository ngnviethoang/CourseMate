using CourseMate.Application.Queries.Lookups;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Lookups;

public class GetListLookupsCategoryQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnAllCategoriesOrderedByName()
    {
        GetListLookupsCategoryQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        List<LookupItemDto> result = await handler.Handle(new GetListLookupsCategoryQuery(), CancellationToken.None);

        Assert.Equal(3, result.Count);
        Assert.Equal("AI", result[0].Value);
        Assert.Equal("Backend", result[1].Value);
        Assert.Equal("Frontend", result[2].Value);
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Admin);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();
            ReadOnlyDbContext = testDbContextScope.CreateReadOnlyDbContext();

            DbContext.Categories.AddRange(
                new Category(Guid.NewGuid(), "Frontend", "Frontend category", true),
                new Category(Guid.NewGuid(), "AI", "AI category", true),
                new Category(Guid.NewGuid(), "Backend", "Backend category", true));

            DbContext.SaveChanges();
        }
    }
}