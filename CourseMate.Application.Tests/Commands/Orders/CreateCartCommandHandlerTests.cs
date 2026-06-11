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

public class CreateCartCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldCreateCartItem_WhenCourseIsNotInCartAndNotEnrolled()
    {
        CreateCartCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        CreateCartCommand request = new()
        {
            CourseId = _testContainer.CourseId,
            StudentId = _testContainer.StudentId
        };

        ResultIdDto result = await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        Cart? cart = await _testContainer.DbContext.Carts.AsNoTracking().FirstOrDefaultAsync(c => c.StudentId == _testContainer.StudentId);
        CartItem? cartItem = await _testContainer.DbContext.CartItems.AsNoTracking().FirstOrDefaultAsync(ci => ci.Id == result.Id);

        Assert.NotNull(cart);
        Assert.NotNull(cartItem);
        Assert.Equal(cart.Id, cartItem.CartId);
        Assert.Equal(_testContainer.CourseId, cartItem.CourseId);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenCourseAlreadyExistsInCart()
    {
        CreateCartCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        CreateCartCommand request = new()
        {
            CourseId = _testContainer.ExistingCartCourseId,
            StudentId = _testContainer.StudentId
        };

        BusinessException exception = await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));

        Assert.Equal(ErrorCode.CourseAlreadyInCart, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenCourseAlreadyEnrolled()
    {
        CreateCartCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        CreateCartCommand request = new()
        {
            CourseId = _testContainer.EnrolledCourseId,
            StudentId = _testContainer.StudentId
        };

        BusinessException exception = await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));

        Assert.Equal(ErrorCode.CourseAlreadyEnrolled, exception.ErrorCode);
    }

    private sealed class TestContainer
    {
        public readonly Guid CategoryId = Guid.NewGuid();
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly Guid EnrolledCourseId = Guid.NewGuid();
        public readonly Guid ExistingCartCourseId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorId = Guid.NewGuid();
        public readonly Guid StudentId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(StudentId, Roles.Student);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();

            DbContext.Users.AddRange(
                new User("student") { Id = StudentId, Email = "student@example.com" },
                new User("instructor") { Id = InstructorId, Email = "instructor@example.com" });

            DbContext.Categories.Add(new Category(CategoryId, "Programming", "Programming category", true));
            DbContext.Courses.AddRange(
                new Course(CourseId, "Algorithms", "Algorithms course", 100, "https://example.com/a.png", true, CategoryId, InstructorId),
                new Course(ExistingCartCourseId, "Databases", "Databases course", 120, "https://example.com/d.png", true, CategoryId, InstructorId),
                new Course(EnrolledCourseId, "Networks", "Networks course", 140, "https://example.com/n.png", true, CategoryId, InstructorId));

            Guid cartId = Guid.NewGuid();
            DbContext.Carts.Add(new Cart(cartId, StudentId));
            DbContext.CartItems.Add(new CartItem(Guid.NewGuid(), cartId, ExistingCartCourseId));
            DbContext.Enrollments.Add(new Enrollment(Guid.NewGuid(), StudentId, EnrolledCourseId));

            DbContext.SaveChanges();
        }
    }
}