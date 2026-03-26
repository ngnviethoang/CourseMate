using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Files;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Commands.Files;

internal sealed class UploadVideoChunkCommandHandler : AbstractCommandHandler<UploadVideoChunkCommand>
{
    private readonly IEnumerable<string> _allowedImageExtensions = [".mp4"];
    private readonly StorageOptions _storageOptions;

    public UploadVideoChunkCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IOptions<StorageOptions> storageOptions)
        : base(dbContext, httpContextAccessor)
    {
        _storageOptions = storageOptions.Value;
    }

    public override async Task Handle(UploadVideoChunkCommand request, CancellationToken cancellationToken)
    {
        if (!_allowedImageExtensions.Contains(Path.GetExtension(request.FileName), StringComparer.OrdinalIgnoreCase))
        {
            throw new BusinessException(ErrorMessages.InvalidFileType);
        }

        if (request.Content.Length > _storageOptions.MaxSizeFileVideo * 1024 * 1024)
        {
            throw new BusinessException(ErrorMessages.FileTooLarge);
        }

        Guid userId = GetCurrentUserId();
        FileEntry? fileEntry = await DbContext.FileEntries
            .Where(f => f.UserId == userId)
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