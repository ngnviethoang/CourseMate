using System.ComponentModel.DataAnnotations;
using Volo.Abp.Domain.Entities.Auditing;

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

    [MaxLength(24)]
    public string Currency { get; set; }

    [MaxLength(1024)]
    public string Gateway { get; set; }

    [MaxLength(1024)]
    public string FailReason { get; set; }
}