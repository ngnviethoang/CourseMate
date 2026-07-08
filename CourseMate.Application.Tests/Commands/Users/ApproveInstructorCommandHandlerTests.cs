using CourseMate.Application.Commands.Users;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Users;

public class ApproveInstructorCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldApproveInstructor_WhenAdminApprovesUser()
    {
        ApproveInstructorCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor, _testContainer.UserManager);

        ApproveInstructorCommand request = new() { InstructorId = _testContainer.UnapprovedInstructorId };

        await handler.Handle(request, CancellationToken.None);

        User? approved = await _testContainer.DbContext.Users.FirstOrDefaultAsync(u => u.Id == _testContainer.UnapprovedInstructorId);

        Assert.NotNull(approved);
        Assert.True(approved.IsApproved);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotFound()
    {
        ApproveInstructorCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor, _testContainer.UserManager);

        ApproveInstructorCommand request = new() { InstructorId = Guid.NewGuid() };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid UnapprovedInstructorId = Guid.NewGuid();
        public readonly UserManager<User> UserManager;

        public TestContainer()
        {
            TestDbContextScope scope = new(Guid.NewGuid(), Roles.Admin);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();
            UserManager = scope.GetUserManager();

            User unapprovedInstructor = new("instructor")
            {
                Id = UnapprovedInstructorId,
                Email = "instructor@example.com",
                IsApproved = false
            };

            // Use UserManager to create the user so it gets proper identity records
            UserManager.CreateAsync(unapprovedInstructor).GetAwaiter().GetResult();
            UserManager.AddToRoleAsync(unapprovedInstructor, Roles.Instructor).GetAwaiter().GetResult();
        }
    }
}