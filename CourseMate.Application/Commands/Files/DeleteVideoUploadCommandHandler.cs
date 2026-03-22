using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Files;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Files;

internal sealed class DeleteVideoUploadCommandHandler : AbstractCommandHandler<DeleteVideoByIdCommand>
{
    public DeleteVideoUploadCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(DeleteVideoByIdCommand request, CancellationToken cancellationToken)
    {
        FileEntry? fileEntry = await DbContext.FileEntries.FirstOrDefaultAsync(f => f.Id == request.FileId, cancellationToken);
        if (fileEntry == null)
        {
            return;
        }

        if (!string.IsNullOrEmpty(fileEntry.TempFilePath) && Directory.Exists(fileEntry.TempFilePath))
        {
            Directory.Delete(fileEntry.TempFilePath, true);
        }

        if (!string.IsNullOrEmpty(fileEntry.FilePath) && File.Exists(fileEntry.FilePath))
        {
            File.Delete(fileEntry.FilePath);
        }

        DbContext.FileEntries.Remove(fileEntry);
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}