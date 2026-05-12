using System.Net;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
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
using PayOS.Models.V2.PaymentRequests;
using PaymentTransaction = CourseMate.Persistent.Entities.PaymentTransaction;

namespace CourseMate.Application.Commands.Payments;

public class CreatePaymentUrlCommand : IRequest<CreatePaymentUrlResponse>
{
    public Guid OrderId { get; set; }
}

internal sealed class CreatePaymentUrlCommandHandler : AbstractCommandHandler<CreatePaymentUrlCommand, CreatePaymentUrlResponse>
{
    private readonly ILogger<CreatePaymentUrlCommandHandler> _logger;
    private readonly PayOsOptions _payOsOptions;

    public CreatePaymentUrlCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IOptions<PayOsOptions> options,
        ILogger<CreatePaymentUrlCommandHandler> logger) : base(dbContext, httpContextAccessor)
    {
        _logger = logger;
        _payOsOptions = options.Value;
    }

    public override async Task<CreatePaymentUrlResponse> Handle(CreatePaymentUrlCommand request, CancellationToken ct)
    {
        Order? order = await DbContext.Orders
            .Where(i => i.StudentId == CurrentUserId)
            .Where(i => i.Id == request.OrderId)
            .Where(i => i.Status == OrderStatus.Submitted || i.Status == OrderStatus.Draft)
            .FirstOrDefaultAsync(ct);
        if (order is null)
        {
            throw new EntityNotFoundException(nameof(Order), request.OrderId);
        }

        string clientIp = Util.GetIpAddress(HttpContextAccessor.HttpContext!);
        if (!IPAddress.TryParse(clientIp, out IPAddress? _))
        {
            _logger.LogWarning("Invalid IP detected - IP: {ClientIp}", clientIp);
            throw new BusinessException(ErrorMessages.InvalidIp);
        }

        long externalOrderId = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        long totalAmount = (long)Math.Ceiling(order.TotalAmount);
        CreatePaymentLinkRequest paymentRequest = new()
        {
            OrderCode = externalOrderId,
            Amount = totalAmount,
            Description = order.Description,
            ReturnUrl = _payOsOptions.ReturnUrl,
            CancelUrl = _payOsOptions.CancelUrl
        };

        PayOSClient client = new(new PayOSOptions
        {
            ClientId = _payOsOptions.ClientId,
            ApiKey = _payOsOptions.SecretKey,
            ChecksumKey = _payOsOptions.ChecksumKey,
            PartnerCode = _payOsOptions.PartnerCode
        });
        CreatePaymentLinkResponse paymentLink = await client.PaymentRequests.CreateAsync(paymentRequest);
        _logger.LogInformation("Payment URL created for Order ID: {OrderId}, URL: {PaymentUrl}", request.OrderId, paymentLink.CheckoutUrl);

        order.Status = OrderStatus.Submitted;
        DbContext.Orders.Update(order);

        PaymentTransaction paymentTransaction = new(
            Guid.NewGuid(),
            order.Id,
            PaymentStatus.Pending,
            "VND",
            totalAmount,
            "PAYOS",
            externalOrderId.ToString(),
            JsonConvert.SerializeObject(paymentRequest),
            string.Empty,
            string.Empty
        );
        await DbContext.PaymentTransactions.AddAsync(paymentTransaction, ct);
        return new CreatePaymentUrlResponse
        {
            CheckoutUrl = paymentLink.CheckoutUrl,
            PaymentTransactionId = paymentTransaction.Id
        };
    }
}