using CourseMate.Application.Commands.Orders;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Orders;

public class DeleteCartCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldDeleteCartItem_WhenCartItemExists()
    {
        DeleteCartCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        Cart? cart = await _testContainer.DbContext.Carts.FirstOrDefaultAsync(c => c.StudentId == _testContainer.StudentId);
        CartItem? cartItem = await _testContainer.DbContext.CartItems.FirstOrDefaultAsync(ci => ci.CartId == cart!.Id);

        Assert.NotNull(cartItem);

        DeleteCartCommand request = new() { CartItemId = cartItem.Id };

        await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        CartItem? deletedItem = await _testContainer.DbContext.CartItems.FirstOrDefaultAsync(ci => ci.Id == cartItem.Id);
        Assert.Null(deletedItem);
    }

    [Fact]
    public async Task Handle_ShouldReturnUnit_WhenCartDoesNotExist()
    {
        DeleteCartCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        DeleteCartCommand request = new() { CartItemId = Guid.NewGuid() };

        Unit result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(Unit.Value, result);
    }

    [Fact]
    public async Task Handle_ShouldReturnUnit_WhenCartItemDoesNotExist()
    {
        DeleteCartCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        DeleteCartCommand request = new() { CartItemId = Guid.NewGuid() };

        Unit result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(Unit.Value, result);
    }

    [Fact]
    public async Task Handle_ShouldDeleteOnlySpecificItem_WhenMultipleItemsExist()
    {
        Guid courseId2 = Guid.NewGuid();
        _testContainer.DbContext.Courses.Add(new Course(
            courseId2, "Test Course 2", "Description", 99, "https://example.com/course2.png", true, _testContainer.CategoryId, _testContainer.InstructorId));
        await _testContainer.DbContext.SaveChangesAsync();

        Cart cart = await _testContainer.DbContext.Carts.FirstAsync(c => c.StudentId == _testContainer.StudentId);

        CartItem cartItem2 = new(Guid.NewGuid(), cart.Id, courseId2);
        _testContainer.DbContext.CartItems.Add(cartItem2);
        await _testContainer.DbContext.SaveChangesAsync();

        CartItem firstItem = await _testContainer.DbContext.CartItems.FirstAsync(ci => ci.CourseId == _testContainer.CourseId);

        DeleteCartCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        DeleteCartCommand request = new() { CartItemId = firstItem.Id };

        await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        CartItem? deletedItem = await _testContainer.DbContext.CartItems.FirstOrDefaultAsync(ci => ci.Id == firstItem.Id);
        CartItem? remainingItem = await _testContainer.DbContext.CartItems.FirstOrDefaultAsync(ci => ci.Id == cartItem2.Id);

        Assert.Null(deletedItem);
        Assert.NotNull(remainingItem);
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
            DbContext.Carts.Add(new Cart(Guid.NewGuid(), StudentId));

            DbContext.SaveChanges();

            Cart cart = DbContext.Carts.First(c => c.StudentId == StudentId);
            DbContext.CartItems.Add(new CartItem(Guid.NewGuid(), cart.Id, CourseId));
            DbContext.SaveChanges();
        }
    }
}