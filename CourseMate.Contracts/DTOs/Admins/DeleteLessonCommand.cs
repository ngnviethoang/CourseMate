using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteLessonCommand : IRequest<int>
{
    public Guid Id { get; set; }
}