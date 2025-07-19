namespace CourseMate.Entities.Orders;

public class Order : FullAuditedEntity<Guid>
{
    public Order(Guid id, Guid studentId, decimal totalAmount, string currency, Guid paymentRequestId) : base(id)
    {
        StudentId = studentId;
        TotalAmount = totalAmount;
        Currency = currency;
        PaymentRequestId = paymentRequestId;
    }

    public Guid StudentId { get; set; }
    public decimal TotalAmount { get; set; }

    [MaxLength(24)]
    public string Currency { get; set; }

    public Guid PaymentRequestId { get; set; }
}