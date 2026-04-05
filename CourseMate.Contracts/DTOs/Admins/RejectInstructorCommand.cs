using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class RejectInstructorCommand : IRequest<int>
{
    public Guid Id { get; set; }
}
