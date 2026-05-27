using CourseMate.Application.Commands.Categories;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Categories;

public class UpdateCategoryCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldUpdateCategory_WhenCategoryExists()
    {
        UpdateCategoryAbstractCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        Guid categoryId = _testContainer.ExistingCategoryId;

        UpdateCategoryCommand request = new()
        {
            Id = categoryId,
            Name = "DevOps Updated",
            Description = "New desc",
            IsActive = false
        };

        await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        Category updated = await _testContainer.DbContext.Categories.AsNoTracking().SingleAsync(x => x.Id == categoryId);

        Assert.Equal(request.Name, updated.Name);
        Assert.Equal(request.Description, updated.Description);
        Assert.Equal(request.IsActive, updated.IsActive);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenCategoryDoesNotExist()
    {
        UpdateCategoryAbstractCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        UpdateCategoryCommand request = new()
        {
            Id = Guid.NewGuid(),
            Name = "Missing",
            Description = "Missing",
            IsActive = true
        };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly Guid ExistingCategoryId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Admin);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();
            DbContext.Categories.Add(new Category(ExistingCategoryId, "DevOps", "Old desc", true));
            DbContext.SaveChanges();
        }
    }
}