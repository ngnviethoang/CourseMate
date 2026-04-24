using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class PaymentTransaction : Entity
{
    public PaymentTransaction(Guid id, Guid orderId, PaymentStatus status, string currency, decimal amount, string provider, string transactionId, string rawRequest, string rawResponse, string failReason) : base(id)
    {
        OrderId = orderId;
        Status = status;
        Currency = currency;
        Amount = amount;
        Provider = provider;
        TransactionId = transactionId;
        FailReason = failReason;
        RawRequest = rawRequest;
        RawResponse = rawResponse;
    }

    public PaymentStatus Status { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Currency { get; set; }

    public decimal Amount { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Provider { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string FailReason { get; set; }

    public Guid OrderId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string TransactionId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string RawRequest { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string RawResponse { get; set; }
}