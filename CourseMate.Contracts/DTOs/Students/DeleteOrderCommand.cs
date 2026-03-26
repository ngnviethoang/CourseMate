using MediatR;

namespace CourseMate.Contracts.DTOs.Students;

public class DeleteOrderCommand : IRequest<int>
{
    public Guid Id { get; init; }
}