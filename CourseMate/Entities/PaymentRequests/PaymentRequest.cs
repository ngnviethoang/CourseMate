namespace CourseMate.Entities.PaymentRequests;

public class PaymentRequest : FullAuditedEntity<Guid>
{
    public PaymentRequest(Guid id, PaymentStateType state, string currency, string gateway, string failReason) : base(id)
    {
        State = state;
        Currency = currency;
        Gateway = gateway;
        FailReason = failReason;
    }

    public PaymentStateType State { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Currency { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Gateway { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string FailReason { get; set; }
}