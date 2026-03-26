using CourseMate.Contracts.Enums;
using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class UpdateOrderCommand : IRequest<int>
{
    public Guid Id { get; set; }

    public OrderStatus Status { get; set; }
}