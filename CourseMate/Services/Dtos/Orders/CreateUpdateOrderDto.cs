using System.ComponentModel.DataAnnotations;

namespace CourseMate.Services.Dtos.Orders;

public class CreateUpdateOrderDto
{
    public Guid StudentId { get; set; }
    public decimal TotalAmount { get; set; }

    [MaxLength(24)]
    public string Currency { get; set; } = string.Empty;

    public Guid PaymentRequestId { get; set; }
    public List<CreateUpdateOrderItemDto> Items { get; set; } = [];
}