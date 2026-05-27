using CourseMate.Application.Commands.Courses;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Courses;

public class UpdateCourseCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldUpdateCourse_WhenInstructorOwnsCourse()
    {
        UpdateCourseCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        UpdateCourseCommand request = new()
        {
            Id = _testContainer.OwnCourseId,
            Title = "Advanced React",
            Description = "Updated description",
            Price = 250,
            ImageUrl = "https://example.com/react-updated.png",
            IsPublished = true,
            CategoryId = _testContainer.SecondCategoryId
        };

        Unit result = await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();
        Course updated = await _testContainer.DbContext.Courses.AsNoTracking().SingleAsync(x => x.Id == _testContainer.OwnCourseId);

        Assert.Equal(Unit.Value, result);
        Assert.Equal(request.Title, updated.Title);
        Assert.Equal(request.Description, updated.Description);
        Assert.Equal(request.Price, updated.Price);
        Assert.Equal(request.ImageUrl, updated.ImageUrl);
        Assert.Equal(request.IsPublished, updated.IsPublished);
        Assert.Equal(request.CategoryId, updated.CategoryId);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenInstructorUpdatesOtherInstructorCourse()
    {
        UpdateCourseCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        UpdateCourseCommand request = new()
        {
            Id = _testContainer.OtherInstructorCourseId,
            Title = "Should fail",
            Description = "Should fail",
            Price = 10,
            ImageUrl = "https://example.com/fail.png",
            IsPublished = false,
            CategoryId = _testContainer.FirstCategoryId
        };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly Guid FirstCategoryId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid OtherInstructorCourseId = Guid.NewGuid();
        public readonly Guid OwnCourseId = Guid.NewGuid();
        public readonly Guid SecondCategoryId = Guid.NewGuid();
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Instructor);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();

            DbContext.Categories.AddRange(
                new Category(FirstCategoryId, "Frontend", "Frontend category", true),
                new Category(SecondCategoryId, "Backend", "Backend category", true));

            DbContext.Courses.AddRange(
                new Course(
                    OwnCourseId,
                    "React Basics",
                    "React course",
                    100,
                    "https://example.com/react.png",
                    false,
                    FirstCategoryId,
                    UserId),
                new Course(
                    OtherInstructorCourseId,
                    "Node Basics",
                    "Node course",
                    120,
                    "https://example.com/node.png",
                    true,
                    FirstCategoryId,
                    Guid.NewGuid()));

            DbContext.SaveChanges();
        }
    }
}