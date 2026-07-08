using CourseMate.Application.Commands.Courses;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Courses;

public class CreateCourseCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldCreateCourseAndReturnId_WhenCategoryExists()
    {
        CreateCourseCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        CreateCourseCommand request = new()
        {
            Title = "Advanced C#",
            Description = "Deep dive into C#",
            Price = 199,
            ImageUrl = "https://example.com/csharp.png",
            IsPublished = true,
            CategoryId = _testContainer.CategoryId
        };

        ResultIdDto result = await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        Course? created = await _testContainer.DbContext.Courses.AsNoTracking().FirstOrDefaultAsync(x => x.Id == result.Id);

        Assert.NotNull(created);
        Assert.Equal(request.Title, created.Title);
        Assert.Equal(request.Description, created.Description);
        Assert.Equal(request.Price, created.Price);
        Assert.Equal(request.ImageUrl, created.ImageUrl);
        Assert.Equal(request.IsPublished, created.IsPublished);
        Assert.Equal(request.CategoryId, created.CategoryId);
        Assert.Equal(_testContainer.UserId, created.InstructorId);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenCategoryDoesNotExist()
    {
        CreateCourseCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        CreateCourseCommand request = new()
        {
            Title = "Missing Category",
            Description = "Missing Category",
            Price = 99,
            ImageUrl = "https://example.com/missing.png",
            IsPublished = false,
            CategoryId = Guid.NewGuid()
        };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly Guid CategoryId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Instructor);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();
            DbContext.Categories.Add(new Category(CategoryId, "Programming", "Programming category", true));
            DbContext.SaveChanges();
        }
    }
}