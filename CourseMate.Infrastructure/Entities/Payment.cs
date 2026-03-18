using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Infrastructure.Entities.Abstracts;

namespace CourseMate.Infrastructure.Entities;

public class Payment : Entity
{
    public Payment(Guid id, Guid orderId, decimal amount, string provider, string transactionId, PaymentStatus status) : base(id)
    {
        OrderId = orderId;
        Amount = amount;
        Provider = provider;
        TransactionId = transactionId;
        Status = status;
    }

    public Guid OrderId { get; set; }

    public decimal Amount { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Provider { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string TransactionId { get; set; }

    public PaymentStatus Status { get; set; }
}