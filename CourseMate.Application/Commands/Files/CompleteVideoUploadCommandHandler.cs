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

    public override async Task<CompleteVideoUploadResponse> Handle(CompletedVideoUploadCommand request, CancellationToken cancellationToken)
    {
        Guid userId = GetCurrentUserId();
        FileEntry? fileEntry = await DbContext.FileEntries
            .Where(f => f.UserId == userId)
            .Where(f => f.Status == FileStatus.Uploading)
            .FirstOrDefaultAsync(f => f.Id == request.FileId, cancellationToken);

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
            .ToListAsync(cancellationToken);

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
                    byte[] chunkData = await File.ReadAllBytesAsync(fileTrunk.ChunkPath, cancellationToken);
                    await outputStream.WriteAsync(chunkData, cancellationToken);
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

        HttpRequest? httpRequest = HttpContextAccessor.HttpContext!.Request;
        string fileUrl = $"{httpRequest.Scheme}://{httpRequest.Host}/api/files/video/{fileEntry.Id}";
        return new CompleteVideoUploadResponse
        {
            FileId = fileEntry.Id,
            FileUrl = fileUrl
        };
    }
}