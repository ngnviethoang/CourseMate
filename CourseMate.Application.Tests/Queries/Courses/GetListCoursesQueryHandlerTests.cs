using CourseMate.Application.Queries.Courses;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Courses;

public class GetListCoursesQueryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnOnlyPublishedCourses_WhenUserIsStudent()
    {
        TestContainer testContainer = new(Roles.Student);
        GetListCoursesQueryHandler handler = new(testContainer.ReadOnlyDbContext, testContainer.HttpContextAccessor);

        GetListCoursesQuery request = new()
        {
            PageIndex = 1,
            PageSize = 10
        };

        PagedDto<CourseDto> result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(2, result.Items.Count());
        Assert.All(result.Items, x => Assert.True(x.IsPublished));
        Assert.DoesNotContain(result.Items, x => x.Id == testContainer.UnpublishedByInstructorAId);
        Assert.DoesNotContain(result.Items, x => x.Id == testContainer.UnpublishedByInstructorBId);
        Assert.True(result.Items.Single(x => x.Id == testContainer.PublishedByInstructorAId).IsEnrollment);
        Assert.False(result.Items.Single(x => x.Id == testContainer.PublishedByInstructorAId).IsInCart);
        Assert.False(result.Items.Single(x => x.Id == testContainer.PublishedByInstructorBId).IsEnrollment);
        Assert.True(result.Items.Single(x => x.Id == testContainer.PublishedByInstructorBId).IsInCart);
    }

    [Fact]
    public async Task Handle_ShouldReturnPublishedAndOwnUnpublishedCourses_WhenUserIsInstructor()
    {
        TestContainer testContainer = new(Roles.Instructor);
        GetListCoursesQueryHandler handler = new(testContainer.ReadOnlyDbContext, testContainer.HttpContextAccessor);

        GetListCoursesQuery request = new()
        {
            PageIndex = 1,
            PageSize = 10
        };

        PagedDto<CourseDto> result = await handler.Handle(request, CancellationToken.None);

        Assert.Contains(result.Items, x => x.Id == testContainer.PublishedByInstructorAId);
        Assert.Contains(result.Items, x => x.Id == testContainer.PublishedByInstructorBId);
        Assert.Contains(result.Items, x => x.Id == testContainer.UnpublishedByInstructorAId);
        Assert.DoesNotContain(result.Items, x => x.Id == testContainer.UnpublishedByInstructorBId);
        Assert.All(result.Items, x =>
        {
            Assert.False(x.IsEnrollment);
            Assert.False(x.IsInCart);
        });
    }

    [Fact]
    public async Task Handle_ShouldApplyCategoryFilterAndPaging_WhenUserIsAdmin()
    {
        TestContainer testContainer = new(Roles.Admin);
        GetListCoursesQueryHandler handler = new(testContainer.ReadOnlyDbContext, testContainer.HttpContextAccessor);

        GetListCoursesQuery request = new()
        {
            CategoryId = testContainer.CategoryAId,
            Sorting = "price_desc",
            PageIndex = 2,
            PageSize = 1
        };

        PagedDto<CourseDto> result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(2, result.TotalCount);
        Assert.Single(result.Items);
        Assert.Equal(testContainer.PublishedByInstructorAId, result.Items.Single().Id);
    }

    private sealed class TestContainer
    {
        private readonly Guid _instructorAId;
        private readonly Guid _instructorBId;
        public readonly Guid CategoryAId = Guid.NewGuid();
        public readonly Guid CategoryBId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid PublishedByInstructorAId = Guid.NewGuid();
        public readonly Guid PublishedByInstructorBId = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid UnpublishedByInstructorAId = Guid.NewGuid();
        public readonly Guid UnpublishedByInstructorBId = Guid.NewGuid();
        public readonly Guid UserId;

        public TestContainer(string role)
        {
            _instructorAId = role == Roles.Instructor ? Guid.NewGuid() : Guid.NewGuid();
            _instructorBId = Guid.NewGuid();
            UserId = role == Roles.Instructor ? _instructorAId : Guid.NewGuid();

            TestDbContextScope testDbContextScope = new(UserId, role);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();
            ReadOnlyDbContext = testDbContextScope.CreateReadOnlyDbContext();

            DbContext.Users.AddRange(
                new User("instructor-a") { Id = _instructorAId, Email = "instructor-a@example.com" },
                new User("instructor-b") { Id = _instructorBId, Email = "instructor-b@example.com" });

            DbContext.Categories.AddRange(
                new Category(CategoryAId, "Backend", "Backend category", true),
                new Category(CategoryBId, "Frontend", "Frontend category", true));

            DbContext.Courses.AddRange(
                new Course(
                    PublishedByInstructorAId,
                    "C# Basics",
                    "C# course",
                    100,
                    "https://example.com/csharp.png",
                    true,
                    CategoryAId,
                    _instructorAId),
                new Course(
                    UnpublishedByInstructorAId,
                    "C# Advanced",
                    "Advanced C# course",
                    300,
                    "https://example.com/csharp-advanced.png",
                    false,
                    CategoryAId,
                    _instructorAId),
                new Course(
                    PublishedByInstructorBId,
                    "React Basics",
                    "React course",
                    120,
                    "https://example.com/react.png",
                    true,
                    CategoryBId,
                    _instructorBId),
                new Course(
                    UnpublishedByInstructorBId,
                    "React Advanced",
                    "Advanced React course",
                    220,
                    "https://example.com/react-advanced.png",
                    false,
                    CategoryBId,
                    _instructorBId));

            if (role == Roles.Student)
            {
                Guid cartId = Guid.NewGuid();
                DbContext.Carts.Add(new Cart(cartId, UserId));
                DbContext.Enrollments.Add(new Enrollment(Guid.NewGuid(), UserId, PublishedByInstructorAId));
                DbContext.CartItems.Add(new CartItem(Guid.NewGuid(), cartId, PublishedByInstructorBId));
            }

            DbContext.SaveChanges();
        }
    }
}
