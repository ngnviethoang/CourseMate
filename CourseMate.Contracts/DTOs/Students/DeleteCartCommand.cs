using MediatR;

namespace CourseMate.Contracts.DTOs.Students;

public class DeleteCartCommand : IRequest
{
    public Guid CartItemId { get; init; }
}