using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Students;

internal sealed class CreateOrderCommandHandler : AbstractCommandHandler<CreateOrderCommand, ResultIdDto>
{
    public CreateOrderCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        Guid studentId = GetCurrentUserId();

        Cart? cart = await DbContext.Carts.FirstOrDefaultAsync(c => c.StudentId == studentId, cancellationToken);
        if (cart == null)
        {
            throw new EntityNotFoundException(nameof(Cart), Guid.Empty);
        }

        List<CartItem> cartItems = await DbContext.CartItems
            .Where(ci => ci.CartId == cart.Id)
            .ToListAsync(cancellationToken);

        if (cartItems.Count == 0)
        {
            throw new EntityNotFoundException(nameof(CartItem), Guid.Empty);
        }

        List<Guid> courseIds = cartItems.Select(ci => ci.CourseId).ToList();
        List<Course> courses = await DbContext.Courses.Where(c => courseIds.Contains(c.Id)).ToListAsync(cancellationToken);

        Guid orderId = Guid.NewGuid();
        decimal totalAmount = courses.Sum(c => c.Price);

        Order order = new(orderId, studentId, totalAmount, OrderStatus.Pending);
        await DbContext.Orders.AddAsync(order, cancellationToken);

        foreach (Course course in courses)
        {
            OrderItem orderItem = new(Guid.NewGuid(), orderId, course.Id, course.Price);
            await DbContext.OrderItems.AddAsync(orderItem, cancellationToken);
        }

        DbContext.CartItems.RemoveRange(cartItems);

        return new ResultIdDto { Id = orderId };
    }
}