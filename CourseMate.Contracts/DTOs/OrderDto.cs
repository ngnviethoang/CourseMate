using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs;

public class OrderDto
{
    public Guid Id { get; set; }

    public Guid StudentId { get; set; }

    public decimal TotalAmount { get; set; }

    public OrderStatus Status { get; set; }

    public List<OrderItemDto> Items { get; set; } = [];
}