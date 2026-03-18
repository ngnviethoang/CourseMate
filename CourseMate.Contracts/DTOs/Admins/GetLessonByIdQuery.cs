using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class GetLessonByIdQuery : IRequest<LessonDto?>
{
    public Guid Id { get; set; }
}