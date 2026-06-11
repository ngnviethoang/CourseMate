using CourseMate.Application.Queries.Orders;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Orders;

public class GetOrderByIdQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnOrderDetails_WhenStudentQueriesOwnOrder()
    {
        GetOrderByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetOrderByIdQuery query = new() { Id = _testContainer.OrderId };

        OrderDto? result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(_testContainer.OrderId, result.Id);
        Assert.Equal(_testContainer.StudentId, result.StudentId);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenOrderNotFound()
    {
        GetOrderByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetOrderByIdQuery query = new() { Id = Guid.NewGuid() };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(query, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenStudentTriesToQueryOthersOrder()
    {
        TestDbContextScope otherScope = new(Guid.NewGuid(), Roles.Student);
        GetOrderByIdQueryHandler handler = new(otherScope.CreateReadOnlyDbContext(), otherScope.HttpContextAccessor);

        GetOrderByIdQuery query = new() { Id = _testContainer.OrderId };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(query, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly Guid CategoryId = Guid.NewGuid();
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorId = Guid.NewGuid();
        public readonly Guid OrderId = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid StudentId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(StudentId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            dbContext.Categories.Add(new Category(CategoryId, "Programming", "Programming category", true));
            dbContext.Users.Add(new User("instructor") { Id = InstructorId });
            dbContext.Courses.Add(new Course(
                CourseId, "Test Course", "Description", 99, "https://example.com/course.png", true, CategoryId, InstructorId));

            Order order = new(OrderId, StudentId, 99, OrderStatus.Completed, "Test Order");
            dbContext.Orders.Add(order);

            OrderItem orderItem = new(Guid.NewGuid(), OrderId, CourseId, 99);
            dbContext.OrderItems.Add(orderItem);

            dbContext.SaveChanges();
        }
    }
}