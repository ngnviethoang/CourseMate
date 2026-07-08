using CourseMate.Application.Queries.Lookups;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Tests.Queries.Lookups;

public class GetListLookupsUserQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnUsersByRequestedRoles()
    {
        GetListLookupsUserQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetListLookupsUserQuery request = new()
        {
            Roles = [Roles.Instructor, Roles.Admin]
        };

        List<LookupItemDto> result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(2, result.Count);
        Assert.Contains(result, x => x.Id == _testContainer.InstructorUserId && x.Value == "instructor-user");
        Assert.Contains(result, x => x.Id == _testContainer.AdminUserId && x.Value == "admin-user");
        Assert.DoesNotContain(result, x => x.Id == _testContainer.StudentUserId);
    }

    [Fact]
    public async Task Handle_ShouldReturnEmpty_WhenRolesIsEmpty()
    {
        GetListLookupsUserQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        List<LookupItemDto> result = await handler.Handle(new GetListLookupsUserQuery(), CancellationToken.None);

        Assert.Empty(result);
    }

    private sealed class TestContainer
    {
        public readonly Guid AdminRoleId = Guid.NewGuid();
        public readonly Guid AdminUserId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorRoleId = Guid.NewGuid();
        public readonly Guid InstructorUserId = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid StudentRoleId = Guid.NewGuid();
        public readonly Guid StudentUserId = Guid.NewGuid();
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Admin);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();
            ReadOnlyDbContext = testDbContextScope.CreateReadOnlyDbContext();

            DbContext.Users.AddRange(
                new User("instructor-user") { Id = InstructorUserId, Email = "instructor@example.com" },
                new User("admin-user") { Id = AdminUserId, Email = "admin@example.com" },
                new User("student-user") { Id = StudentUserId, Email = "student@example.com" });

            DbContext.Roles.AddRange(
                new IdentityRole<Guid> { Id = InstructorRoleId, Name = Roles.Instructor, NormalizedName = Roles.Instructor.ToUpperInvariant() },
                new IdentityRole<Guid> { Id = AdminRoleId, Name = Roles.Admin, NormalizedName = Roles.Admin.ToUpperInvariant() },
                new IdentityRole<Guid> { Id = StudentRoleId, Name = Roles.Student, NormalizedName = Roles.Student.ToUpperInvariant() });

            DbContext.UserRoles.AddRange(
                new IdentityUserRole<Guid> { UserId = InstructorUserId, RoleId = InstructorRoleId },
                new IdentityUserRole<Guid> { UserId = AdminUserId, RoleId = AdminRoleId },
                new IdentityUserRole<Guid> { UserId = StudentUserId, RoleId = StudentRoleId });

            DbContext.SaveChanges();
        }
    }
}