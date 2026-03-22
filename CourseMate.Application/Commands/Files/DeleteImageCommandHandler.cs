using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Files;
using CourseMate.Contracts.Enums;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Files;

internal sealed class DeleteImageCommandHandler : AbstractCommandHandler<DeleteImageCommand>
{
    public DeleteImageCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(DeleteImageCommand request, CancellationToken cancellationToken)
    {
        Guid userId = GetCurrentUserId();
        FileEntry? fileEntry = await DbContext.FileEntries
            .Where(f => f.UserId == userId)
            .Where(f => f.FileType == FileType.Image)
            .FirstOrDefaultAsync(f => f.Id == request.FileId, cancellationToken);

        if (fileEntry == null)
        {
            return;
        }

        if (File.Exists(fileEntry.FilePath))
        {
            File.Delete(fileEntry.FilePath);
        }

        DbContext.FileEntries.Remove(fileEntry);
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}