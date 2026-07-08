using CourseMate.Application.Commands.Orders;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Orders;

public class CreateEnrollmentFreeCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldCreateEnrollment_WhenCourseIsFreePublishedAndStudentNotEnrolled()
    {
        CreateEnrollmentFreeCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        CreateEnrollmentFreeCommand request = new()
        {
            CourseId = _testContainer.FreeCourseId
        };

        ResultIdDto result = await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        Enrollment? enrollment = await _testContainer.DbContext.Enrollments.AsNoTracking().FirstOrDefaultAsync(e => e.Id == result.Id);

        Assert.NotNull(enrollment);
        Assert.Equal(_testContainer.StudentId, enrollment.StudentId);
        Assert.Equal(_testContainer.FreeCourseId, enrollment.CourseId);
    }

    [Fact]
    public async Task Handle_ShouldReturnExistingEnrollmentId_WhenStudentAlreadyEnrolled()
    {
        CreateEnrollmentFreeCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        CreateEnrollmentFreeCommand request = new()
        {
            CourseId = _testContainer.EnrolledCourseId
        };

        ResultIdDto result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(_testContainer.ExistingEnrollmentId, result.Id);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenCourseIsNotFreePublished()
    {
        CreateEnrollmentFreeCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        CreateEnrollmentFreeCommand request = new()
        {
            CourseId = _testContainer.PaidCourseId
        };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly Guid CategoryId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly Guid EnrolledCourseId = Guid.NewGuid();
        public readonly Guid ExistingEnrollmentId = Guid.NewGuid();
        public readonly Guid FreeCourseId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorId = Guid.NewGuid();
        public readonly Guid PaidCourseId = Guid.NewGuid();
        public readonly Guid StudentId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(StudentId, Roles.Student);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();

            DbContext.Categories.Add(new Category(CategoryId, "Programming", "Programming category", true));
            DbContext.Users.Add(new User("instructor") { Id = InstructorId, Email = "instructor@example.com" });
            DbContext.Courses.AddRange(
                new Course(FreeCourseId, "Free Course", "Free course", 0, "https://example.com/free.png", true, CategoryId, InstructorId),
                new Course(PaidCourseId, "Paid Course", "Paid course", 199, "https://example.com/paid.png", true, CategoryId, InstructorId),
                new Course(EnrolledCourseId, "Enrolled Course", "Enrolled course", 0, "https://example.com/enrolled.png", true, CategoryId, InstructorId));
            DbContext.Enrollments.Add(new Enrollment(ExistingEnrollmentId, StudentId, EnrolledCourseId));

            DbContext.SaveChanges();
        }
    }
}