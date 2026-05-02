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

        IQueryable<CartItem> cartItemsQuery = DbContext.CartItems.Where(ci => ci.CartId == cart.Id);
        
        // If specific course IDs are provided, filter by them
        if (request.CourseIds != null && request.CourseIds.Any())
        {
            cartItemsQuery = cartItemsQuery.Where(ci => request.CourseIds.Contains(ci.CourseId));
        }

        List<CartItem> cartItems = await cartItemsQuery.ToListAsync(ct);

        if (cartItems.Count == 0)
        {
            // If cart is empty, check if there's an existing Draft order to return
            Order? existingDraft = await DbContext.Orders
                .OrderByDescending(o => o.CreationTime)
                .FirstOrDefaultAsync(o => o.StudentId == CurrentUserId && o.Status == OrderStatus.Draft, ct);

            if (existingDraft != null)
            {
                return new ResultIdDto { Id = existingDraft.Id };
            }

            throw new BusinessException("Giỏ hàng của bạn đang trống.");
        }

        List<Guid> courseIds = cartItems.Select(ci => ci.CourseId).ToList();
        List<Course> courses = await DbContext.Courses.Where(c => courseIds.Contains(c.Id)).ToListAsync(ct);

        // Delete existing Draft orders to keep things clean
        await DbContext.Orders
            .Where(o => o.StudentId == CurrentUserId && o.Status == OrderStatus.Draft)
            .ExecuteDeleteAsync(ct);

        Guid orderId = Guid.NewGuid();
        decimal totalAmount = courses.Sum(c => c.Price);

        Order order = new(orderId, CurrentUserId, totalAmount, OrderStatus.Draft, $"Thanh toán cho {courses.Count} khoá học");
        await DbContext.Orders.AddAsync(order, ct);

        foreach (Course course in courses)
        {
            OrderItem orderItem = new(Guid.NewGuid(), orderId, course.Id, course.Price);
            await DbContext.OrderItems.AddAsync(orderItem, ct);
        }

        return new ResultIdDto { Id = orderId };
    }
}