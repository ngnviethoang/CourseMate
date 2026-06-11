using CourseMate.Application.Queries.Orders;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Orders;

public class GetListOrdersQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnStudentOrders_WhenStudentQueriesOwnOrders()
    {
        GetListOrdersQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetListOrdersQuery query = new();

        PagedDto<OrderDto> result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.NotEmpty(result.Items);
        Assert.All(result.Items, o => Assert.Equal(_testContainer.StudentId, o.StudentId));
    }

    [Fact]
    public async Task Handle_ShouldReturnEmptyList_WhenStudentHasNoOrders()
    {
        TestDbContextScope scope = new(Guid.NewGuid(), Roles.Student);
        GetListOrdersQueryHandler handler = new(scope.CreateReadOnlyDbContext(), scope.HttpContextAccessor);

        GetListOrdersQuery query = new();

        PagedDto<OrderDto> result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Empty(result.Items);
    }

    private sealed class TestContainer
    {
        public readonly Guid CategoryId = Guid.NewGuid();
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorId = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid StudentId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(StudentId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            dbContext.Categories.Add(new Category(CategoryId, "Programming", "Programming category", true));
            dbContext.Users.Add(new User("student") { Id = StudentId, Email = "student@test.com" });
            dbContext.Users.Add(new User("instructor") { Id = InstructorId });
            dbContext.Courses.Add(new Course(
                CourseId, "Test Course", "Description", 99, "https://example.com/course.png", true, CategoryId, InstructorId));

            Order order = new(Guid.NewGuid(), StudentId, 99, OrderStatus.Completed, "Test Order");
            dbContext.Orders.Add(order);

            OrderItem orderItem = new(Guid.NewGuid(), order.Id, CourseId, 99);
            dbContext.OrderItems.Add(orderItem);

            dbContext.SaveChanges();
        }
    }
}