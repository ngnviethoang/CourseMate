using CourseMate.Application.Queries.Orders;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Orders;

public class GetCartQueryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnEmptyCart_WhenStudentHasNoCart()
    {
        TestContainer testContainer = new(false);
        GetCartQueryHandler handler = new(testContainer.ReadOnlyDbContext, testContainer.HttpContextAccessor);
        GetCartQuery request = new();

        CartDto? result = await handler.Handle(request, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(testContainer.StudentId, result.StudentId);
        Assert.Empty(result.Items);
        Assert.Equal(0, result.TotalPrice);
    }

    [Fact]
    public async Task Handle_ShouldReturnCartItemsAndTotalPrice_WhenStudentHasCart()
    {
        TestContainer testContainer = new(true);
        GetCartQueryHandler handler = new(testContainer.ReadOnlyDbContext, testContainer.HttpContextAccessor);
        GetCartQuery request = new();

        CartDto? result = await handler.Handle(request, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(testContainer.StudentId, result.StudentId);
        Assert.Equal(2, result.Items.Count);
        Assert.Equal(300, result.TotalPrice);
        Assert.Contains(result.Items, x => x.CourseId == testContainer.CourseAId);
        Assert.Contains(result.Items, x => x.CourseId == testContainer.CourseBId);
    }

    [Fact]
    public async Task Handle_ShouldUseRequestedStudentId_WhenUserIsAdmin()
    {
        TestContainer testContainer = new(true, Roles.Admin);
        GetCartQueryHandler handler = new(testContainer.ReadOnlyDbContext, testContainer.HttpContextAccessor);
        GetCartQuery request = new()
        {
            StudentId = testContainer.StudentId
        };

        CartDto? result = await handler.Handle(request, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(testContainer.StudentId, result.StudentId);
        Assert.Equal(2, result.Items.Count);
    }

    private sealed class TestContainer
    {
        public readonly Guid CartId = Guid.NewGuid();
        public readonly Guid CategoryId = Guid.NewGuid();
        public readonly Guid CourseAId = Guid.NewGuid();
        public readonly Guid CourseBId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorId = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid StudentId = Guid.NewGuid();

        public TestContainer(bool seedCart, string role = Roles.Student)
        {
            Guid currentUserId = role == Roles.Admin ? Guid.NewGuid() : StudentId;

            TestDbContextScope testDbContextScope = new(currentUserId, role);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            CourseMateDbContext dbContext = testDbContextScope.CreateWriteDbContext();
            ReadOnlyDbContext = testDbContextScope.CreateReadOnlyDbContext();

            dbContext.Users.Add(new User("instructor") { Id = InstructorId, Email = "instructor@example.com" });
            dbContext.Categories.Add(new Category(CategoryId, "Programming", "Programming category", true));
            dbContext.Courses.AddRange(
                new Course(CourseAId, "Course A", "Course A", 100, "https://example.com/a.png", true, CategoryId, InstructorId),
                new Course(CourseBId, "Course B", "Course B", 200, "https://example.com/b.png", true, CategoryId, InstructorId));

            if (seedCart)
            {
                dbContext.Carts.Add(new Cart(CartId, StudentId));
                dbContext.CartItems.AddRange(
                    new CartItem(Guid.NewGuid(), CartId, CourseAId),
                    new CartItem(Guid.NewGuid(), CartId, CourseBId));
            }

            dbContext.SaveChanges();
        }
    }
}