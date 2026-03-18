using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteLessonCommand : IRequest
{
    public Guid Id { get; set; }
}