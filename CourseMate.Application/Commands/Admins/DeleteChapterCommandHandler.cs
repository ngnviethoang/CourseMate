using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using CourseMate.Infrastructure.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class DeleteChapterAbstractCommandHandler : AbstractCommandHandler<DeleteChapterCommand>
{
    public DeleteChapterAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(DeleteChapterCommand request, CancellationToken cancellationToken)
    {
        await DbContext.Chapters.RemoveByIdAsync(request.Id, cancellationToken);
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}