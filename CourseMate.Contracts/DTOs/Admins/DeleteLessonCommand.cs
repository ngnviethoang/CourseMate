using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class DeleteLessonCommand : IRequest
{
    public DeleteLessonCommand(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}