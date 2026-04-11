using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Admins;

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

    public override async Task<int> Handle(DeleteCourseCommand request, CancellationToken cancellationToken)
    {
        await DbContext.Courses.RemoveByIdAsync(request.Id, cancellationToken);
        return Codes.Success;
    }
}