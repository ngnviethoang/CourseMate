using MediatR;

namespace CourseMate.Contracts.DTOs.Students;

public class GetOrderByIdQuery : IRequest<OrderDto?>
{
    public Guid Id { get; init; }
}