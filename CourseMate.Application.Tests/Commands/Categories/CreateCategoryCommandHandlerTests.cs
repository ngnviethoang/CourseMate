using CourseMate.Application.Commands.Categories;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Categories;

public class CreateCategoryCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldCreateCategoryAndReturnId()
    {
        CreateCategoryCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        CreateCategoryCommand request = new()
        {
            Name = "Backend",
            Description = "All backend courses",
            IsActive = true
        };
        ResultIdDto result = await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();
        Category? created = await _testContainer.DbContext.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == result.Id);
        Assert.NotNull(created);
        Assert.Equal(request.Name, created.Name);
        Assert.Equal(request.Description, created.Description);
        Assert.True(created.IsActive);
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Admin);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();
        }
    }
}