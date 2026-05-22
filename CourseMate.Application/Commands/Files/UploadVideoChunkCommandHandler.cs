using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Commands.Files;

public class UploadVideoChunkCommand : IRequest<int>
{
    public Guid FileId { get; set; }

    public string FileName { get; set; } = string.Empty;

    public int ChunkIndex { get; set; }

    public byte[] Content { get; set; } = [];
}

internal sealed class UploadVideoChunkCommandHandler : AbstractCommandHandler<UploadVideoChunkCommand, int>
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

    public override async Task<int> Handle(UploadVideoChunkCommand request, CancellationToken ct)
    {
        if (!_allowedImageExtensions.Contains(Path.GetExtension(request.FileName), StringComparer.InvariantCultureIgnoreCase))
        {
            throw new BusinessException(ErrorCode.InvalidFileType, "Invalid file type. This file type is not allowed.");
        }

        if (request.Content.Length > _storageOptions.MaxChunkSizeMb * 1024 * 1024)
        {
            throw new BusinessException(ErrorCode.FileTooLarge, "File too large.");
        }

        Guid userId = CurrentUserId;
        FileEntry? fileEntry = await DbContext.FileEntries.FirstOrDefaultAsync(f =>
                f.Id == request.FileId &&
                f.UserId == userId &&
                f.Status == FileStatus.Uploading,
            ct);

        if (fileEntry == null)
        {
            throw new EntityNotFoundException(nameof(FileEntry), request.FileId);
        }

        string chunkFileName = $"{fileEntry.Id}_chunk_{request.ChunkIndex}.dat";
        string chunkFilePath = Path.Combine(_storageOptions.TempPath, chunkFileName);
        if (File.Exists(chunkFilePath))
        {
            File.Delete(chunkFilePath);
        }

        await using FileStream stream = new(chunkFilePath, FileMode.CreateNew, FileAccess.Write, FileShare.None);
        await stream.WriteAsync(request.Content, ct);

        FileChunk fileChunk = new(
            Guid.NewGuid(),
            fileEntry.Id,
            request.ChunkIndex,
            chunkFilePath.Replace(_storageOptions.TempPath, string.Empty),
            request.Content.LongLength,
            true);
        await DbContext.FileChunks.AddAsync(fileChunk, ct);
        fileEntry.UploadedChunks += 1;
        DbContext.FileEntries.Update(fileEntry);
        return Codes.Success;
    }
}