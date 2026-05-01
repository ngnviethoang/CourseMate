using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Orders;

public class CreateOrderCommand : IRequest<ResultIdDto>
{
    public IEnumerable<Guid> CourseIds { get; set; } = [];
}

internal sealed class CreateOrderCommandHandler : AbstractCommandHandler<CreateOrderCommand, ResultIdDto>
{
    public CreateOrderCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateOrderCommand request, CancellationToken ct)
    {
        Cart? cart = await DbContext.Carts.FirstOrDefaultAsync(c => c.StudentId == CurrentUserId, ct);
        if (cart == null)
        {
            throw new EntityNotFoundException(nameof(Cart), Guid.Empty);
        }

        List<CartItem> cartItems = await DbContext.CartItems
            .Where(ci => request.CourseIds.Contains(ci.CourseId))
            .ToListAsync(ct);

        if (cartItems.Count == 0)
        {
            throw new EntityNotFoundException(nameof(CartItem), Guid.Empty);
        }

        List<Course> courses = await DbContext.Courses.Where(c => request.CourseIds.Contains(c.Id)).ToListAsync(ct);

        Guid orderId = Guid.NewGuid();
        decimal totalAmount = courses.Sum(c => c.Price);

        Order order = new(orderId, CurrentUserId, totalAmount, OrderStatus.Draft, string.Empty);
        await DbContext.Orders.AddAsync(order, ct);

        foreach (Course course in courses)
        {
            OrderItem orderItem = new(Guid.NewGuid(), orderId, course.Id, course.Price);
            await DbContext.OrderItems.AddAsync(orderItem, ct);
        }

        DbContext.CartItems.RemoveRange(cartItems);

        return new ResultIdDto { Id = orderId };
    }
}