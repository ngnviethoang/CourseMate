using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class GetOrderByIdQuery : IRequest<AdminOrderDto?>
{
    public Guid Id { get; set; }
}
