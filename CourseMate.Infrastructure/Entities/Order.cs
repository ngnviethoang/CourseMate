using CourseMate.Contract.Enums;
using CourseMate.Core.Entities.Abstracts;

namespace CourseMate.Core.Entities;

public class Order : Entity
{
    public Order(Guid id, Guid studentId, decimal totalAmount, OrderStatus status) : base(id)
    {
        StudentId = studentId;
        TotalAmount = totalAmount;
        Status = status;
    }

    public Guid StudentId { get; set; }

    public decimal TotalAmount { get; set; }

    public OrderStatus Status { get; set; }
}