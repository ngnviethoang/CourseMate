using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteCourseCommand : IRequest
{
    public Guid Id { get; set; }
}