using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Admins;

public class DeleteLessonCommand : IRequest<int>
{
    public Guid Id { get; set; }
}

internal sealed class DeleteLessonAbstractCommandHandler : AbstractCommandHandler<DeleteLessonCommand, int>
{
    public DeleteLessonAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(DeleteLessonCommand request, CancellationToken cancellationToken)
    {
        await DbContext.Lessons.RemoveByIdAsync(request.Id, cancellationToken);
        return Codes.Success;
    }
}