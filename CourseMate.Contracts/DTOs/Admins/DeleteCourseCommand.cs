using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteCourseCommand : IRequest<int>
{
    public Guid Id { get; set; }
}