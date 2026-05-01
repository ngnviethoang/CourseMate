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

public class CompletedVideoUploadCommand : IRequest<CompleteVideoUploadResponse>
{
    public Guid FileId { get; set; }
    public int TotalChunks { get; set; }
}

// TODO Refactor to background job
internal sealed class CompleteVideoUploadCommandHandler : AbstractCommandHandler<CompletedVideoUploadCommand, CompleteVideoUploadResponse>
{
    private readonly StorageOptions _storageOptions;

    public CompleteVideoUploadCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IOptions<StorageOptions> storageOptions)
        : base(dbContext, httpContextAccessor)
    {
        _storageOptions = storageOptions.Value;
    }

    public override async Task<CompleteVideoUploadResponse> Handle(CompletedVideoUploadCommand request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        FileEntry? fileEntry = await DbContext.FileEntries
            .Where(f => f.UserId == userId)
            .Where(f => f.Status == FileStatus.Uploading)
            .FirstOrDefaultAsync(f => f.Id == request.FileId, ct);

        if (fileEntry == null)
        {
            throw new EntityNotFoundException(nameof(FileEntry), request.FileId);
        }

        if (fileEntry.UploadedChunks < request.TotalChunks)
        {
            throw new BusinessException(string.Format(ErrorMessages.UploadIncomplete, fileEntry.UploadedChunks, request.TotalChunks));
        }

        string dirVideoPath = Path.Combine(_storageOptions.VideosPath, userId.ToString());
        if (!Directory.Exists(dirVideoPath))
        {
            Directory.CreateDirectory(dirVideoPath);
        }

        string fileName = $"{fileEntry.Id}{Path.GetExtension(fileEntry.FileName)}";
        string filePath = Path.Combine(dirVideoPath, fileName);

        List<FileChunk> fileTrunks = await DbContext.FileChunks
            .Where(f => f.FileEntryId == fileEntry.Id)
            .OrderBy(f => f.ChunkIndex)
            .ToListAsync(ct);

        foreach (FileChunk fileTrunk in fileTrunks)
        {
            if (!File.Exists(fileTrunk.ChunkPath))
            {
                throw new BusinessException(string.Format(ErrorMessages.ChunkFileMissing, fileTrunk.ChunkIndex, fileEntry.Id));
            }
        }

        try
        {
            await using (FileStream outputStream = new(filePath, FileMode.CreateNew, FileAccess.Write))
            {
                foreach (FileChunk fileTrunk in fileTrunks)
                {
                    byte[] chunkData = await File.ReadAllBytesAsync(fileTrunk.ChunkPath, ct);
                    await outputStream.WriteAsync(chunkData, ct);
                }
            }

            fileEntry.TotalChunks = request.TotalChunks;
            fileEntry.Status = FileStatus.Completed;
            fileEntry.FilePath = filePath;
            fileEntry.CompletedAt = DateTimeOffset.UtcNow;
            fileEntry.TotalChunks = fileTrunks.Count;
            string tempPath = Path.Combine(_storageOptions.TempPath, fileEntry.Id.ToString());
            Directory.Delete(tempPath, true);
        }
        catch (OperationCanceledException)
        {
            fileEntry.Status = FileStatus.Failed;
        }

        HttpRequest httpRequest = HttpContextAccessor.HttpContext!.Request;
        string fileUrl = $"{httpRequest.Scheme}://{httpRequest.Host}/api/files/videos/stream/{fileEntry.Id}";
        return new CompleteVideoUploadResponse
        {
            FileId = fileEntry.Id,
            FileUrl = fileUrl
        };
    }
}