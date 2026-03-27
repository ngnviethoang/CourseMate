using CourseMate.Contracts.DTOs.Commons;
using MediatR;

namespace CourseMate.Contracts.DTOs.Students;

public class CreateCartCommand : IRequest<ResultIdDto>
{
    public Guid CourseId { get; init; }
}