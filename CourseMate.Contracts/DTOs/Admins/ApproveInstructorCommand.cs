using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class ApproveInstructorCommand : IRequest<int>
{
    public Guid Id { get; set; }
}
