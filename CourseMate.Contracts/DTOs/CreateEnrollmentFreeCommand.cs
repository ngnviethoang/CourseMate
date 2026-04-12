using CourseMate.Contracts.DTOs.Commons;
using MediatR;

namespace CourseMate.Contracts.DTOs.Students;

public class CreateEnrollmentFreeCommand : IRequest<ResultIdDto>
{
    public Guid CourseId { get; set; }
}