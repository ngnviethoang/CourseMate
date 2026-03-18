using MediatR;

namespace CourseMate.Contracts.DTOs.Students;

public class GetCartQuery : IRequest<CartDto?>
{
}