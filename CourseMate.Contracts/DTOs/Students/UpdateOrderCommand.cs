using CourseMate.Contracts.Enums;
using MediatR;

namespace CourseMate.Contracts.DTOs.Students;

public class UpdateOrderCommand : IRequest<int>
{
    public Guid Id { get; init; }

    public OrderStatus Status { get; init; }
}