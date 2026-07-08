using CourseMate.Application.Commands.Orders;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Orders;

public class DeleteOrderCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldDeleteOrder_WhenStudentDeletesOwnOrder()
    {
        DeleteOrderCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        DeleteOrderCommand request = new() { Id = _testContainer.OrderId };

        await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        Order? deleted = await _testContainer.DbContext.Orders.FirstOrDefaultAsync(o => o.Id == _testContainer.OrderId);

        Assert.Null(deleted);
    }

    [Fact]
    public async Task Handle_ShouldReturnUnit_WhenStudentTriesToDeleteOthersOrder()
    {
        Guid otherStudentId = Guid.NewGuid();
        TestDbContextScope otherScope = new(otherStudentId, Roles.Student);
        CourseMateDbContext otherDbContext = otherScope.CreateWriteDbContext();

        DeleteOrderCommandHandler handler = new(otherDbContext, otherScope.HttpContextAccessor);

        DeleteOrderCommand request = new() { Id = _testContainer.OrderId };
        await handler.Handle(request, CancellationToken.None);
    }

    [Fact]
    public async Task Handle_ShouldReturnUnit_WhenOrderNotFound()
    {
        DeleteOrderCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        DeleteOrderCommand request = new() { Id = Guid.NewGuid() };

        await handler.Handle(request, CancellationToken.None);
    }

    private sealed class TestContainer
    {
        public readonly Guid CategoryId = Guid.NewGuid();
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorId = Guid.NewGuid();
        public readonly Guid OrderId = Guid.NewGuid();
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

            Order order = new(OrderId, StudentId, 99, OrderStatus.Completed, "Test Order");
            DbContext.Orders.Add(order);

            OrderItem orderItem = new(Guid.NewGuid(), OrderId, CourseId, 99);
            DbContext.OrderItems.Add(orderItem);

            DbContext.SaveChanges();
        }
    }
}