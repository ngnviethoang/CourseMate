using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using PayOS;
using PayOS.Exceptions;
using PayOS.Models.Webhooks;
using PaymentTransaction = CourseMate.Persistent.Entities.PaymentTransaction;

namespace CourseMate.Application.Commands.Payments;

public class IpnUrlCallbackCommand : Webhook, IRequest<Unit>;

internal sealed class IpnUrlCallbackCommandHandler : AbstractCommandHandler<IpnUrlCallbackCommand, Unit>
{
    private readonly ILogger<IpnUrlCallbackCommandHandler> _logger;
    private readonly PayOsOptions _payOsOptions;

    public IpnUrlCallbackCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IOptions<PayOsOptions> options,
        ILogger<IpnUrlCallbackCommandHandler> logger) : base(dbContext, httpContextAccessor)
    {
        _logger = logger;
        _payOsOptions = options.Value;
    }

    public override async Task<Unit> Handle(IpnUrlCallbackCommand request, CancellationToken ct)
    {
        PayOSClient client = new(new PayOSOptions
        {
            ClientId = _payOsOptions.ClientId,
            ApiKey = _payOsOptions.SecretKey,
            ChecksumKey = _payOsOptions.ChecksumKey,
            PartnerCode = _payOsOptions.PartnerCode
        });

        try
        {
            _logger.LogInformation("Verifying webhook...");
            WebhookData webhookData = await client.Webhooks.VerifyAsync(request);

            #region Sample request for test

            if (webhookData is { OrderCode: 123, Description: "VQRIO123", AccountNumber: "12345678" })
            {
                return Unit.Value;
            }

            #endregion

            string orderCode = webhookData.OrderCode.ToString();
            PaymentTransaction? paymentTransaction = await DbContext.PaymentTransactions
                .Where(i => i.Status == PaymentStatus.Pending && string.Equals(i.TransactionId, orderCode))
                .FirstOrDefaultAsync(ct);

            if (paymentTransaction is null)
            {
                _logger.LogWarning("No pending payment transaction found for orderCode={OrderCode}", orderCode);
                return Unit.Value;
            }

            paymentTransaction.RawResponse = JsonConvert.SerializeObject(request);
            Order? order = await DbContext.Orders.FirstOrDefaultAsync(i => i.Id == paymentTransaction.OrderId, ct);
            if (order is null)
            {
                _logger.LogWarning("No order found for PaymentTransactionId={TransactionId}", paymentTransaction.Id);
                return Unit.Value;
            }

            _logger.LogInformation("Found order: {OrderId}, Status={Status}, TotalAmount={Amount}", order.Id, order.Status, order.TotalAmount);

            if (order.Status == OrderStatus.Submitted && order.TotalAmount == webhookData.Amount)
            {
                bool isSuccess = string.Equals(webhookData.Code, "00");
                order.Status = isSuccess ? OrderStatus.Completed : OrderStatus.Cancelled;
                paymentTransaction.Status = isSuccess ? PaymentStatus.Paid : PaymentStatus.Failed;
                DbContext.Orders.Update(order);
                DbContext.PaymentTransactions.Update(paymentTransaction);
                if (isSuccess)
                {
                    await HandleEnrollmentAsync(order.Id, order.StudentId, ct);
                }

                _logger.LogInformation("Webhook processed successfully for orderCode={OrderCode}", orderCode);
            }

            return Unit.Value;
        }
        catch (PayOSException ex)
        {
            throw new BusinessException(ErrorCode.Unknown, $"Webhook processing error {ex.Message}");
        }
    }

    private async Task HandleEnrollmentAsync(Guid orderId, Guid studentId, CancellationToken ct)
    {
        List<Guid> courseIds = await DbContext.OrderItems
            .Where(x => x.OrderId == orderId)
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

        List<CartItem> cartItems = await (
            from cart in DbContext.Carts
            join cartItem in DbContext.CartItems on cart.Id equals cartItem.CartId
            where cart.StudentId == studentId
                  && courseIds.Contains(cartItem.CourseId)
            select cartItem
        ).ToListAsync(ct);

        DbContext.CartItems.RemoveRange(cartItems);
    }
}