using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
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

public class CompletedVideoUploadCommand : IRequest<FileUploadResponse>
{
    public Guid FileId { get; set; }
    public int TotalChunks { get; set; }
}

// TODO Refactor to background job
public sealed class CompleteVideoUploadCommandHandler : AbstractCommandHandler<CompletedVideoUploadCommand, FileUploadResponse>
{
    private readonly StorageOptions _storageOptions;

    public CompleteVideoUploadCommandHandler(
        IOptions<StorageOptions> storageOptions,
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
        _storageOptions = storageOptions.Value;
    }

    public override async Task<FileUploadResponse> Handle(CompletedVideoUploadCommand request, CancellationToken ct)
    {
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

        if (fileEntry.UploadedChunks != request.TotalChunks)
        {
            throw new BusinessException(ErrorCode.UploadIncomplete, string.Format("Upload incomplete. {0}/{1} chunks uploaded.", fileEntry.UploadedChunks, request.TotalChunks));
        }

        List<FileChunk> fileTrunks = await DbContext.FileChunks
            .Where(f => f.FileEntryId == fileEntry.Id)
            .OrderBy(f => f.ChunkIndex)
            .ToListAsync(ct);

        foreach (FileChunk fileTrunk in fileTrunks)
        {
            if (!File.Exists(Path.Combine(_storageOptions.TempPath, fileTrunk.ChunkLocation)))
            {
                throw new BusinessException(ErrorCode.ChunkFileMissing, $"Chunk {fileTrunk.ChunkIndex} for upload '{fileEntry.Id}' is missing.");
            }
        }

        try
        {
            string filePath = Path.Combine(_storageOptions.RootPath, fileEntry.FileLocation);
            await using (FileStream outputStream = new(filePath, FileMode.CreateNew, FileAccess.Write))
            {
                foreach (FileChunk fileTrunk in fileTrunks)
                {
                    byte[] chunkData = await File.ReadAllBytesAsync(Path.Combine(_storageOptions.TempPath, fileTrunk.ChunkLocation), ct);
                    await outputStream.WriteAsync(chunkData, ct);
                    File.Delete(Path.Combine(_storageOptions.TempPath, fileTrunk.ChunkLocation));
                }
            }

            fileEntry.Status = FileStatus.Completed;
            fileEntry.CompletedAt = DateTimeOffset.UtcNow;
            fileEntry.TotalChunks = fileTrunks.Count;
            fileEntry.FileSize = fileTrunks.Sum(f => f.ChunkSize);
        }
        catch (OperationCanceledException)
        {
            fileEntry.Status = FileStatus.Failed;
        }

        HttpRequest httpRequest = HttpContextAccessor.HttpContext!.Request;
        string fileUrl = $"{httpRequest.Scheme}://{httpRequest.Host}/api/files/videos/stream/{fileEntry.Id}";
        return new FileUploadResponse
        {
            FileId = fileEntry.Id,
            FileUrl = fileUrl
        };
    }
}