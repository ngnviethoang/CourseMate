using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Files;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Files;

internal sealed class UploadVideoChunkCommandHandler : AbstractCommandHandler<UploadVideoChunkCommand>
{
    public UploadVideoChunkCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(UploadVideoChunkCommand request, CancellationToken cancellationToken)
    {
        Guid userId = GetCurrentUserId();
        FileEntry? fileEntry = await DbContext.FileEntries
            .Where(f => f.UserId == userId)
            .Where(f => f.UploadedChunks < f.TotalChunks)
            .Where(f => f.Status == FileStatus.Uploading)
            .FirstOrDefaultAsync(f => f.Id == request.FileId, cancellationToken);

        if (fileEntry == null)
        {
            throw new EntityNotFoundException(nameof(FileEntry), request.FileId);
        }

        string chunkFileName = $"chunk_{request.ChunkIndex:D5}.dat";
        string chunkFilePath = Path.Combine(fileEntry.TempFilePath, chunkFileName);
        if (File.Exists(chunkFilePath))
        {
            File.Delete(chunkFilePath);
        }

        await using FileStream stream = new(chunkFilePath, FileMode.CreateNew, FileAccess.Write, FileShare.None);
        await stream.WriteAsync(request.Content, cancellationToken);

        FileChunk fileChunk = new(Guid.NewGuid(), fileEntry.Id, request.ChunkIndex, chunkFilePath, request.Content.LongLength, true);
        await DbContext.FileChunks.AddAsync(fileChunk, cancellationToken);

        fileEntry.UploadedChunks += 1;
        DbContext.FileEntries.Update(fileEntry);

        await DbContext.SaveChangesAsync(cancellationToken);
    }
}