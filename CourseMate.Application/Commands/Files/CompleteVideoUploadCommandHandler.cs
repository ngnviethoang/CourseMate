using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Files;

public class CompletedVideoUploadCommand : IRequest<FileUploadResponse>
{
    public Guid FileId { get; set; }
    public int TotalChunks { get; set; }
}

// TODO Refactor to background job
internal sealed class CompleteVideoUploadCommandHandler : AbstractCommandHandler<CompletedVideoUploadCommand, FileUploadResponse>
{
    public CompleteVideoUploadCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
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
            throw new BusinessException(string.Format(ErrorMessages.UploadIncomplete, fileEntry.UploadedChunks, request.TotalChunks));
        }

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
            Util.CreateDirectoryIfNotExist(fileEntry.FilePath);
            await using (FileStream outputStream = new(fileEntry.FilePath, FileMode.CreateNew, FileAccess.Write))
            {
                foreach (FileChunk fileTrunk in fileTrunks)
                {
                    byte[] chunkData = await File.ReadAllBytesAsync(fileTrunk.ChunkPath, ct);
                    await outputStream.WriteAsync(chunkData, ct);
                }
            }

            fileEntry.Status = FileStatus.Completed;
            fileEntry.CompletedAt = DateTimeOffset.UtcNow;
            fileEntry.TotalChunks = fileTrunks.Count;
            Directory.Delete(fileEntry.TempDirPath, true);
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