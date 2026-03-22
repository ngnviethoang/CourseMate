using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Files;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Files;

// TODO Refactor to background job
internal sealed class CompleteVideoUploadCommandHandler : AbstractCommandHandler<CompleteVideoUploadCommand>
{
    public CompleteVideoUploadCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(CompleteVideoUploadCommand request, CancellationToken cancellationToken)
    {
        Guid userId = GetCurrentUserId();
        FileEntry? fileEntry = await DbContext.FileEntries
            .Where(f => f.UserId == userId)
            .FirstOrDefaultAsync(f => f.Id == request.UploadId, cancellationToken);

        if (fileEntry == null)
        {
            throw new EntityNotFoundException(nameof(FileEntry), request.UploadId);
        }

        if (fileEntry.Status != FileStatus.Uploading)
        {
            throw new BusinessException(ErrorMessages.FileIsNotInUploadingState);
        }

        if (fileEntry.UploadedChunks < fileEntry.TotalChunks)
        {
            throw new BusinessException($"Upload incomplete. {fileEntry.UploadedChunks}/{fileEntry.TotalChunks} chunks uploaded.");
        }

        try
        {
            string finalFileName = $"{fileEntry.Id}_{Path.GetFileNameWithoutExtension(fileEntry.FileName)}{Path.GetExtension(fileEntry.FileName)}";
            string finalFilePath = Path.Combine("uploads", "videos", finalFileName);
            string fullFinalPath = Path.Combine(Directory.GetCurrentDirectory(), finalFilePath);

            Directory.CreateDirectory(Path.GetDirectoryName(fullFinalPath)!);

            using (FileStream outputStream = new(fullFinalPath, FileMode.Create, FileAccess.Write))
            {
                for (int i = 0; i < fileEntry.TotalChunks; i++)
                {
                    string chunkFileName = $"chunk_{i:D5}.dat";
                    string chunkFilePath = Path.Combine(fileEntry.TempFilePath!, chunkFileName);

                    if (!File.Exists(chunkFilePath))
                    {
                        throw new BusinessException($"Chunk {i} is missing");
                    }

                    byte[] chunkData = await File.ReadAllBytesAsync(chunkFilePath, cancellationToken);
                    await outputStream.WriteAsync(chunkData, cancellationToken);
                }
            }

            // Update file entry status
            fileEntry.Status = FileStatus.Processing;
            fileEntry.FilePath = finalFilePath;
            fileEntry.CompletedAt = DateTime.UtcNow;
            await DbContext.SaveChangesAsync(cancellationToken);

            // Clean up temporary files
            if (Directory.Exists(fileEntry.TempFilePath))
            {
                Directory.Delete(fileEntry.TempFilePath, true);
            }

            // Trigger video processing asynchronously
            _ = Task.Run(() => ProcessVideoAsync(fileEntry.Id.ToString(), cancellationToken), cancellationToken);
        }
        catch (Exception ex)
        {
            fileEntry.Status = FileStatus.Failed;
            await DbContext.SaveChangesAsync(cancellationToken);
            throw;
        }
    }

    private async Task ProcessVideoAsync(string uploadId, CancellationToken cancellationToken)
    {
        try
        {
            FileEntry? fileEntry = await DbContext.FileEntries.FirstOrDefaultAsync(f => f.Id.ToString() == uploadId, cancellationToken);
            if (fileEntry != null)
            {
                fileEntry.Status = FileStatus.Completed;
                await DbContext.SaveChangesAsync(cancellationToken);
            }
        }
        catch (Exception ex)
        {
            FileEntry? fileEntry = await DbContext.FileEntries.FirstOrDefaultAsync(f => f.Id.ToString() == uploadId, cancellationToken);
            if (fileEntry != null)
            {
                fileEntry.Status = FileStatus.Failed;
                fileEntry.ErrorMessage = ex.Message;
                await DbContext.SaveChangesAsync(cancellationToken);
            }
        }
    }
}