using CourseMate.Contracts.DTOs.Admins;
using MediatR;

namespace CourseMate.Contracts.DTOs.Instructors;

public class GetInstructorLessonByIdQuery : IRequest<LessonDto?>
{
    public Guid Id { get; set; }
}