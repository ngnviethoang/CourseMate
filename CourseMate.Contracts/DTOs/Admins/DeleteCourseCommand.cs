using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class DeleteCourseCommand : IRequest
{
    public DeleteCourseCommand(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}