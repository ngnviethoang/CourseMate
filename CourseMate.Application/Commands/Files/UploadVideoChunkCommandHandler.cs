using CourseMate.Application.Services.FileStorageServices;
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
using Newtonsoft.Json;

namespace CourseMate.Application.Commands.Files;

public class UploadVideoChunkCommand : IRequest<Unit>
{
    public Guid FileId { get; set; }

    public string FileName { get; set; } = string.Empty;

    public int ChunkIndex { get; set; }

    [JsonIgnore]
    public byte[] Content { get; set; } = [];
}

public sealed class UploadVideoChunkCommandHandler : AbstractCommandHandler<UploadVideoChunkCommand, Unit>
{
    private readonly IEnumerable<string> _allowedImageExtensions = [".mp4"];
    private readonly IFileStorageManager _fileStorageManager;
    private readonly StorageOptions _storageOptions;

    public UploadVideoChunkCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IFileStorageManager fileStorageManager,
        IOptions<StorageOptions> storageOptions)
        : base(dbContext, httpContextAccessor)
    {
        _fileStorageManager = fileStorageManager;
        _storageOptions = storageOptions.Value;
    }

    public override async Task<Unit> Handle(UploadVideoChunkCommand request, CancellationToken ct)
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
        string chunkFileLocation = Path.Combine("temp", chunkFileName);
        StorageFileEntry storageChunk = new()
        {
            Id = Guid.NewGuid(),
            FileName = chunkFileName,
            FileLocation = chunkFileLocation
        };
        if (await _fileStorageManager.ExistsAsync(storageChunk, ct))
        {
            await _fileStorageManager.DeleteAsync(storageChunk, ct);
        }

        await using MemoryStream stream = new(request.Content);
        await _fileStorageManager.CreateAsync(storageChunk, stream, ct);

        FileChunk fileChunk = new(
            storageChunk.Id,
            fileEntry.Id,
            request.ChunkIndex,
            chunkFileLocation,
            request.Content.LongLength,
            true);
        await DbContext.FileChunks.AddAsync(fileChunk, ct);
        fileEntry.UploadedChunks += 1;
        DbContext.FileEntries.Update(fileEntry);
        return Unit.Value;
    }
}