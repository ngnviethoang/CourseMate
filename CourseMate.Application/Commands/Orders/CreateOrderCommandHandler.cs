using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
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
    public IEnumerable<Guid> CartItemIds { get; set; } = [];
}

public sealed class CreateOrderCommandHandler : AbstractCommandHandler<CreateOrderCommand, ResultIdDto>
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
            .Where(ci => request.CartItemIds.Contains(ci.Id))
            .Where(ci => ci.CartId == cart.Id)
            .ToListAsync(ct);
        if (!cartItems.Any())
        {
            throw new BusinessException(ErrorCode.EmptyOrder, "Order must contain at least one item.");
        }

        DbContext.CartItems.RemoveRange(cartItems);

        List<Guid> courseIds = cartItems.Select(i => i.CourseId).Distinct().ToList();
        List<Course> courses = await DbContext.Courses.Where(c => courseIds.Contains(c.Id)).ToListAsync(ct);
        if (!courses.Any())
        {
            throw new BusinessException(ErrorCode.EmptyOrder, "Order must contain at least one item.");
        }

        Order order = new(Guid.NewGuid(), CurrentUserId, courses.Sum(c => c.Price), OrderStatus.Draft, $"Payment for {courses.Count} courses");
        await DbContext.Orders.AddAsync(order, ct);
        foreach (Course course in courses)
        {
            OrderItem orderItem = new(Guid.NewGuid(), order.Id, course.Id, course.Price);
            await DbContext.OrderItems.AddAsync(orderItem, ct);
        }

        return new ResultIdDto { Id = order.Id };
    }
}