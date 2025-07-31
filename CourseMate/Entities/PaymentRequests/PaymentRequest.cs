namespace CourseMate.Entities.PaymentRequests;

public class PaymentRequest : FullAuditedEntity<Guid>
{
    public PaymentRequest(Guid id, PaymentStatusType status, string currency, string gateway, string failReason, Guid orderId, string transactionId) : base(id)
    {
        Status = status;
        Currency = currency;
        Gateway = gateway;
        FailReason = failReason;
        OrderId = orderId;
        TransactionId = transactionId;
    }

    public PaymentStatusType Status { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Currency { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Gateway { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string FailReason { get; set; }

    public Guid OrderId { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string TransactionId { get; set; }
}