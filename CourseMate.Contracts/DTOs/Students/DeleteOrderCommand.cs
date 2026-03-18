using MediatR;

namespace CourseMate.Contracts.DTOs.Students;

public class DeleteOrderCommand : IRequest
{
    public Guid Id { get; init; }
}