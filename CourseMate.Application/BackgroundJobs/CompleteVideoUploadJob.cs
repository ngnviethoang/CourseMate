using CourseMate.Application.Services.NotificationServices;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.BackgroundJobs;

public class CompleteVideoUploadJob
{
    private readonly CourseMateDbContext _dbContext;
    private readonly ILogger<CompleteVideoUploadJob> _logger;
    private readonly INotificationService _notificationService;
    private readonly StorageOptions _storageOptions;

    public CompleteVideoUploadJob(
        CourseMateDbContext dbContext,
        ILogger<CompleteVideoUploadJob> logger,
        INotificationService notificationService,
        IOptions<StorageOptions> storageOptions)
    {
        _dbContext = dbContext;
        _logger = logger;
        _notificationService = notificationService;
        _storageOptions = storageOptions.Value;
    }

    [AutomaticRetry(Attempts = 0)]
    public async Task ExecuteAsync(Guid fileId, Guid userId, Guid? lessonId, CancellationToken ct)
    {
        FileEntry? fileEntry = await _dbContext.FileEntries.FirstOrDefaultAsync(
            f => f.Id == fileId && f.Status == FileStatus.Uploading, ct);
        if (fileEntry == null)
        {
            return;
        }

        _logger.LogInformation("Start merging video chunks for file {FileId}", fileId);

        try
        {
            List<FileChunk> fileChunks = await _dbContext.FileChunks
                .Where(f => f.FileEntryId == fileEntry.Id)
                .OrderBy(f => f.ChunkIndex)
                .ToListAsync(ct);

            foreach (FileChunk chunk in fileChunks)
            {
                if (!File.Exists(Path.Combine(_storageOptions.TempPath, chunk.ChunkLocation)))
                {
                    throw new BusinessException(ErrorCode.ChunkFileMissing,
                        $"Chunk {chunk.ChunkIndex} for upload '{fileEntry.Id}' is missing.");
                }
            }

            string filePath = Path.Combine(_storageOptions.RootPath, fileEntry.FileLocation);
            await using (FileStream outputStream = new(filePath, FileMode.CreateNew, FileAccess.Write))
            {
                foreach (FileChunk chunk in fileChunks)
                {
                    byte[] chunkData = await File.ReadAllBytesAsync(
                        Path.Combine(_storageOptions.TempPath, chunk.ChunkLocation), ct);
                    await outputStream.WriteAsync(chunkData, ct);
                    File.Delete(Path.Combine(_storageOptions.TempPath, chunk.ChunkLocation));
                }
            }

            fileEntry.Status = FileStatus.Completed;
            fileEntry.CompletedAt = DateTimeOffset.UtcNow;
            fileEntry.TotalChunks = fileChunks.Count;
            fileEntry.FileSize = fileChunks.Sum(f => f.ChunkSize);
            await _dbContext.SaveChangesAsync(ct);

            string videoUrl = $"/api/files/videos/stream/{fileEntry.Id}";

            if (lessonId.HasValue)
            {
                LessonVideo? existing = await _dbContext.LessonVideos
                    .FirstOrDefaultAsync(v => v.LessonId == lessonId.Value, ct);
                if (existing != null)
                {
                    existing.VideoUrl = videoUrl;
                }
                else
                {
                    await _dbContext.LessonVideos.AddAsync(
                        new LessonVideo(Guid.NewGuid(), lessonId.Value, videoUrl), ct);
                }

                await _dbContext.SaveChangesAsync(ct);
            }

            _logger.LogInformation("Finished merging video for file {FileId}", fileId);

            await _notificationService.NotifyVideoProcessedAsync(
                userId, fileId, videoUrl, true, "Video đã sẵn sàng.", ct);
        }
        catch
        {
            fileEntry.Status = FileStatus.Failed;
            await _dbContext.SaveChangesAsync(ct);

            await _notificationService.NotifyVideoProcessedAsync(
                userId, fileId, string.Empty, false, "Ghép video thất bại.", ct);

            throw;
        }
    }
}
