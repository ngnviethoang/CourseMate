using MediatR;

namespace CourseMate.Contracts.DTOs.Students;

public class GetLessonByIdQuery : IRequest<LessonDetailDto?>
{
    public Guid Id { get; set; }
}