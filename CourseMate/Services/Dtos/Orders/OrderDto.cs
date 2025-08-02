namespace CourseMate.Services.Dtos.Orders;

public class OrderDto : AuditedEntityDto<Guid>
{
    public Guid StudentId { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // Extra Properties
    public List<OrderItemDto> Items { get; set; } = [];
}