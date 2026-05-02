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
        Order? order = await DbContext.Orders.FirstOrDefaultAsync(x => x.Id == request.OrderId, ct);
        if (order == null)
        {
            throw new EntityNotFoundException(nameof(Order), request.OrderId);
        }

        Guid studentId = order.StudentId;
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
            .Where(x => x.StudentId == studentId && courseIds.Contains(x.CourseId))
            .Select(x => x.CourseId)
            .ToListAsync(ct);

        List<Enrollment> newEnrollments = courseIds
            .Except(existingCourseIds)
            .Select(courseId => new Enrollment(Guid.NewGuid(), studentId, courseId))
            .ToList();

        if (newEnrollments.Count > 0)
        {
            await DbContext.Enrollments.AddRangeAsync(newEnrollments, ct);
        }

        await DbContext.CartItems
            .Where(ci => DbContext.Carts.Any(c => c.Id == ci.CartId && c.StudentId == studentId) && courseIds.Contains(ci.CourseId))
            .ExecuteDeleteAsync(ct);

        return Codes.Success;
    }
}