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
            .Where(f => f.Status != FileStatus.Uploading)
            .Where(f => f.TotalChunks == 0 || f.TotalChunks == request.TotalChunks)
            .FirstOrDefaultAsync(f => f.Id == request.UploadId, cancellationToken);

        if (fileEntry == null)
        {
            throw new EntityNotFoundException(nameof(FileEntry), request.UploadId);
        }

        string chunkFileName = $"chunk_{request.ChunkIndex:D5}.dat";
        string chunkFilePath = Path.Combine(fileEntry.TempFilePath, chunkFileName);
        FileChunk fileChunk = new(Guid.NewGuid(), fileEntry.Id, request.ChunkIndex, chunkFilePath, request.Content.LongLength, false);
        await DbContext.FileChunks.AddAsync(fileChunk, cancellationToken);
        await File.WriteAllBytesAsync(chunkFilePath, request.Content, cancellationToken);

        fileChunk.IsUploaded = true;
        DbContext.FileChunks.Update(fileChunk);

        fileEntry.UploadedChunks = await DbContext.FileChunks
            .Where(i => i.FileEntryId == fileEntry.Id)
            .CountAsync(i => i.IsUploaded, cancellationToken: cancellationToken);
        DbContext.FileEntries.Update(fileEntry);

        await DbContext.SaveChangesAsync(cancellationToken);
    }
}