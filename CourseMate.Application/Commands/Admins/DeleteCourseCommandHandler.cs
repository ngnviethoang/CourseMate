using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Admins;

internal sealed class DeleteCourseAbstractCommandHandler : AbstractCommandHandler<DeleteCourseCommand, int>
{
    public DeleteCourseAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(DeleteCourseCommand request, CancellationToken cancellationToken)
    {
        await DbContext.Courses.RemoveByIdAsync(request.Id, cancellationToken);
        return Codes.Success;
    }
}