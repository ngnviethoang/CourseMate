namespace CourseMate.Contracts.DTOs.Students;

public class CartDto
{
    public Guid Id { get; set; }

    public Guid StudentId { get; set; }

    public decimal TotalPrice { get; set; }

    public List<CartItemDto> Items { get; set; } = [];
}