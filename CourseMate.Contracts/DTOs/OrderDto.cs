using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs;

public class OrderDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public Guid StudentId { get; set; }

    public string? StudentName { get; set; }

    public string? StudentEmail { get; set; }

    public decimal TotalAmount { get; set; }

    public OrderStatus Status { get; set; }

    public DateTimeOffset CreationTime { get; set; }

    public DateTimeOffset? LastModificationTime { get; set; }

    public int ItemsCount { get; set; }

    public List<OrderItemDto> Items { get; set; } = [];
}