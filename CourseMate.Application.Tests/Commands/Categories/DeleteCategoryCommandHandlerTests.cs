using CourseMate.Application.Commands.Categories;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Categories;

public class DeleteCategoryCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldDeleteCategory_WhenNoCourseUsesIt()
    {
        DeleteCategoryAbstractCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        Guid categoryId = _testContainer.CategoryWithoutCourseId;

        await handler.Handle(new DeleteCategoryCommand { Id = categoryId }, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        bool exists = await _testContainer.DbContext.Categories.AnyAsync(x => x.Id == categoryId);
        Assert.False(exists);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenCategoryHasCourses()
    {
        DeleteCategoryAbstractCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        Guid categoryId = _testContainer.CategoryWithCourseId;
        BusinessException exception = await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(new DeleteCategoryCommand { Id = categoryId }, CancellationToken.None));
        Assert.Equal(ErrorCode.CategoryHasCourses, exception.ErrorCode);
        bool exists = await _testContainer.DbContext.Categories.AnyAsync(x => x.Id == categoryId);
        Assert.True(exists);
    }

    private sealed class TestContainer
    {
        public readonly Guid CategoryWithCourseId = Guid.NewGuid();
        public readonly Guid CategoryWithoutCourseId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Admin);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();
            DbContext.Categories.AddRange(new Category(CategoryWithoutCourseId, "AI", "AI courses", true), new Category(CategoryWithCourseId, "Web", "Web courses", true));
            DbContext.Courses.Add(new Course(Guid.NewGuid(), "React", "React for beginners", 10, "https://example.com/react.png", true, CategoryWithCourseId, Guid.NewGuid()));
            DbContext.SaveChanges();
        }
    }
}