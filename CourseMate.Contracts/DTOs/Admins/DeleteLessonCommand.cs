using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteLessonCommand : IRequest
{
    public DeleteLessonCommand(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}