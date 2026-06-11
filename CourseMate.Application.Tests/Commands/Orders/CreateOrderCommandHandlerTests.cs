using CourseMate.Application.Commands.Orders;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Orders;

public class CreateOrderCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldCreateOrderAndRemoveSelectedCartItems_WhenCartContainsRequestedItems()
    {
        CreateOrderCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        CreateOrderCommand request = new()
        {
            CartItemIds = [_testContainer.CartItemAId, _testContainer.CartItemBId]
        };

        ResultIdDto result = await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        Order? order = await _testContainer.DbContext.Orders.AsNoTracking().FirstOrDefaultAsync(o => o.Id == result.Id);
        List<OrderItem> orderItems = await _testContainer.DbContext.OrderItems.AsNoTracking().Where(oi => oi.OrderId == result.Id).ToListAsync();
        List<CartItem> remainingCartItems = await _testContainer.DbContext.CartItems.AsNoTracking().ToListAsync();

        Assert.NotNull(order);
        Assert.Equal(_testContainer.StudentId, order.StudentId);
        Assert.Equal(OrderStatus.Draft, order.Status);
        Assert.Equal(300, order.TotalAmount);
        Assert.Equal(2, orderItems.Count);
        Assert.DoesNotContain(remainingCartItems, ci => ci.Id == _testContainer.CartItemAId);
        Assert.DoesNotContain(remainingCartItems, ci => ci.Id == _testContainer.CartItemBId);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenRequestedCartItemsAreEmpty()
    {
        CreateOrderCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        CreateOrderCommand request = new()
        {
            CartItemIds = [Guid.NewGuid()]
        };

        BusinessException exception = await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));

        Assert.Equal(ErrorCode.EmptyOrder, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenStudentHasNoCart()
    {
        TestContainer testContainer = new(false);
        CreateOrderCommandHandler handler = new(testContainer.DbContext, testContainer.HttpContextAccessor);
        CreateOrderCommand request = new()
        {
            CartItemIds = [Guid.NewGuid()]
        };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly Guid CartId = Guid.NewGuid();
        public readonly Guid CartItemAId = Guid.NewGuid();
        public readonly Guid CartItemBId = Guid.NewGuid();
        public readonly Guid CategoryId = Guid.NewGuid();
        public readonly Guid CourseAId = Guid.NewGuid();
        public readonly Guid CourseBId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorId = Guid.NewGuid();
        public readonly Guid StudentId = Guid.NewGuid();

        public TestContainer(bool seedCart = true)
        {
            TestDbContextScope testDbContextScope = new(StudentId, Roles.Student);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();

            DbContext.Categories.Add(new Category(CategoryId, "Programming", "Programming category", true));
            DbContext.Users.Add(new User("instructor") { Id = InstructorId, Email = "instructor@example.com" });
            DbContext.Courses.AddRange(
                new Course(CourseAId, "Course A", "Course A", 100, "https://example.com/a.png", true, CategoryId, InstructorId),
                new Course(CourseBId, "Course B", "Course B", 200, "https://example.com/b.png", true, CategoryId, InstructorId));

            if (seedCart)
            {
                DbContext.Carts.Add(new Cart(CartId, StudentId));
                DbContext.CartItems.AddRange(
                    new CartItem(CartItemAId, CartId, CourseAId),
                    new CartItem(CartItemBId, CartId, CourseBId));
            }

            DbContext.SaveChanges();
        }
    }
}