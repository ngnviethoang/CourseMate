using CourseMate.Application.Commands.Reviews;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Reviews;

public class ReviewCourseCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldCreateCourseReview_WhenStudentEnrolledInCourse()
    {
        ReviewCourseCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        ReviewCourseCommand request = new()
        {
            CourseId = _testContainer.CourseId,
            Rating = 5,
            Comment = "Great course!"
        };

        await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        Review? review = await _testContainer.DbContext.Reviews.FirstOrDefaultAsync(r => r.CourseId == _testContainer.CourseId && r.StudentId == _testContainer.StudentId);

        Assert.NotNull(review);
        Assert.Equal(5, review.Rating);
        Assert.Equal("Great course!", review.Comment);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenCourseNotFoundAndEnrolled()
    {
        ReviewCourseCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        // First add enrollment for a non-existent course
        Guid fakeCourseId = Guid.NewGuid();
        _testContainer.DbContext.Enrollments.Add(new Enrollment(Guid.NewGuid(), _testContainer.StudentId, fakeCourseId));
        await _testContainer.DbContext.SaveChangesAsync();

        ReviewCourseCommand request = new()
        {
            CourseId = fakeCourseId,
            Rating = 5,
            Comment = "Test"
        };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldThrowUnauthorizedException_WhenStudentNotEnrolled()
    {
        Guid otherStudentId = Guid.NewGuid();
        TestDbContextScope otherScope = new(otherStudentId, Roles.Student);
        CourseMateDbContext otherDbContext = otherScope.CreateWriteDbContext();

        ReviewCourseCommandHandler handler = new(otherDbContext, otherScope.HttpContextAccessor);

        ReviewCourseCommand request = new()
        {
            CourseId = _testContainer.CourseId,
            Rating = 5,
            Comment = "Test"
        };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly Guid CategoryId = Guid.NewGuid();
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorId = Guid.NewGuid();
        public readonly Guid StudentId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(StudentId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();

            DbContext.Categories.Add(new Category(CategoryId, "Programming", "Programming", true));
            DbContext.Users.Add(new User("instructor") { Id = InstructorId });
            DbContext.Courses.Add(new Course(
                CourseId, "Test Course", "Description", 99, "https://example.com/course.png", true, CategoryId, InstructorId));
            DbContext.Enrollments.Add(new Enrollment(Guid.NewGuid(), StudentId, CourseId));

            DbContext.SaveChanges();
        }
    }
}