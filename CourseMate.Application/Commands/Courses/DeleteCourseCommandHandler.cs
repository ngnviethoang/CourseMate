using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Courses;

public class DeleteCourseCommand : IRequest<int>
{
    public Guid Id { get; set; }
}

internal sealed class DeleteCourseAbstractCommandHandler : AbstractCommandHandler<DeleteCourseCommand, int>
{
    public DeleteCourseAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(DeleteCourseCommand request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        bool isExisted = DbContext.Courses
            .WhereIf(IsInRole(Roles.Instructor), c => c.InstructorId == userId)
            .Any(i => i.Id == request.Id);

        if (!isExisted)
        {
            throw new UnauthorizedAccessException();
        }

        await DbContext.Courses.RemoveByIdAsync(request.Id, ct);
        return Codes.Success;
    }
}