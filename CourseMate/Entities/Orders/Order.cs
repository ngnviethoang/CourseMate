namespace CourseMate.Entities.Orders;

public class Order : FullAuditedEntity<Guid>
{
    public Order(Guid id, Guid studentId, decimal totalAmount, string currency, OrderStatusType status, string description) : base(id)
    {
        StudentId = studentId;
        TotalAmount = totalAmount;
        Currency = currency;
        Status = status;
        Description = description;
    }

    public Guid StudentId { get; set; }
    public decimal TotalAmount { get; set; }

    [MaxLength(24)]
    public string Currency { get; set; }

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Description { get; set; }

    public OrderStatusType Status { get; set; }
}