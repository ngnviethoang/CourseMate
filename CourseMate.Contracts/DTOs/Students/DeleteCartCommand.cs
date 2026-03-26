using MediatR;

namespace CourseMate.Contracts.DTOs.Students;

public class DeleteCartCommand : IRequest<int>
{
    public Guid CartItemId { get; init; }
}