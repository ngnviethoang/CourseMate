using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteCourseCommand : IRequest
{
    public DeleteCourseCommand(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}