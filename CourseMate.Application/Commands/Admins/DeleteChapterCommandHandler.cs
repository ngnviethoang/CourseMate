using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.ExtensionMethods;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Admins;

internal sealed class DeleteChapterAbstractCommandHandler : AbstractCommandHandler<DeleteChapterCommand, int>
{
    public DeleteChapterAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(DeleteChapterCommand request, CancellationToken cancellationToken)
    {
        await DbContext.Chapters.RemoveByIdAsync(request.Id, cancellationToken);
        return Codes.Success;
    }
}