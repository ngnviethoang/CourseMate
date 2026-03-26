using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs.Admins;

public class AdminOrderDto
{
    public Guid Id { get; set; }

    public Guid StudentId { get; set; }

    public string StudentName { get; set; } = string.Empty;

    public string StudentEmail { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }

    public OrderStatus Status { get; set; }

    public int ItemsCount { get; set; }

    public DateTimeOffset CreationTime { get; set; }

    public List<AdminOrderItemDto> Items { get; set; } = [];
}