using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Payments;

public class FakeIpnUrlCallbackCommand : IRequest<int>
{
    public Guid OrderId { get; set; }
    public Guid StudentId { get; set; }
    public Guid PaymentTransactionId { get; set; }
}

internal sealed class FakeIpnUrlCallbackCommandHandler : AbstractCommandHandler<FakeIpnUrlCallbackCommand, int>
{
    public FakeIpnUrlCallbackCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(FakeIpnUrlCallbackCommand request, CancellationToken ct)
    {
        Order? order = DbContext.Orders.FirstOrDefault(x => x.Id == request.OrderId);
        if (order == null)
        {
            throw new EntityNotFoundException(nameof(Order), request.OrderId);
        }

        order.Status = OrderStatus.Completed;
        DbContext.Orders.Update(order);

        PaymentTransaction? paymentTransaction = DbContext.PaymentTransactions.FirstOrDefault(x => x.Id == request.PaymentTransactionId);
        if (paymentTransaction == null)
        {
            throw new EntityNotFoundException(nameof(Order), request.OrderId);
        }

        paymentTransaction.Status = PaymentStatus.Paid;
        DbContext.PaymentTransactions.Update(paymentTransaction);

        List<Guid> courseIds = await DbContext.OrderItems
            .Where(x => x.OrderId == request.OrderId)
            .Select(x => x.CourseId)
            .Distinct()
            .ToListAsync(ct);

        List<Guid> existingCourseIds = await DbContext.Enrollments
            .Where(x => x.StudentId == request.StudentId && courseIds.Contains(x.CourseId))
            .Select(x => x.CourseId)
            .ToListAsync(ct);

        List<Enrollment> newEnrollments = courseIds
            .Except(existingCourseIds)
            .Select(courseId => new Enrollment(Guid.NewGuid(), request.StudentId, courseId))
            .ToList();

        if (newEnrollments.Count > 0)
        {
            await DbContext.Enrollments.AddRangeAsync(newEnrollments, ct);
        }

        List<CartItem> cartItems = await (
            from cart in DbContext.Carts
            join cartItem in DbContext.CartItems on cart.Id equals cartItem.CartId
            where cart.StudentId == request.StudentId && courseIds.Contains(cartItem.CourseId)
            select cartItem
        ).ToListAsync(ct);
        DbContext.CartItems.RemoveRange(cartItems);

        return Codes.Success;
    }
}