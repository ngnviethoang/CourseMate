using CourseMate.Application.Commands.Courses;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Courses;

public class DeleteCourseCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldDeleteCourse_WhenAdminDeletesExistingCourse()
    {
        TestContainer testContainer = new(Roles.Admin);
        DeleteCourseAbstractCommandHandler handler = new(testContainer.DbContext, testContainer.HttpContextAccessor);

        Unit result = await handler.Handle(new DeleteCourseCommand { Id = testContainer.CourseId }, CancellationToken.None);
        await testContainer.DbContext.SaveChangesAsync();
        bool exists = await testContainer.DbContext.Courses.AnyAsync(x => x.Id == testContainer.CourseId);

        Assert.Equal(Unit.Value, result);
        Assert.False(exists);
    }

    [Fact]
    public async Task Handle_ShouldThrowUnauthorizedAccessException_WhenInstructorDeletesOtherInstructorCourse()
    {
        TestContainer testContainer = new(Roles.Instructor);
        DeleteCourseAbstractCommandHandler handler = new(testContainer.DbContext, testContainer.HttpContextAccessor);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(new DeleteCourseCommand { Id = testContainer.CourseId }, CancellationToken.None));

        bool exists = await testContainer.DbContext.Courses.AnyAsync(x => x.Id == testContainer.CourseId);
        Assert.True(exists);
    }

    private sealed class TestContainer
    {
        public readonly Guid CategoryId = Guid.NewGuid();
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer(string role)
        {
            TestDbContextScope testDbContextScope = new(UserId, role);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();

            DbContext.Categories.Add(new Category(CategoryId, "Web", "Web category", true));
            DbContext.Courses.Add(new Course(
                CourseId,
                "ASP.NET Core",
                "ASP.NET Core course",
                150,
                "https://example.com/aspnet.png",
                true,
                CategoryId,
                Guid.NewGuid()));

            DbContext.SaveChanges();
        }
    }
}