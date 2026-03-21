using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.ExtensionMethods;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Admins;

internal sealed class DeleteLessonAbstractCommandHandler : AbstractCommandHandler<DeleteLessonCommand>
{
    public DeleteLessonAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(DeleteLessonCommand request, CancellationToken cancellationToken)
    {
        await DbContext.Lessons.RemoveByIdAsync(request.Id, cancellationToken);
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}