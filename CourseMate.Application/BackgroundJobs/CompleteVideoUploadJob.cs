using CourseMate.Application.Services.FileStorageServices;
using CourseMate.Application.Services.NotificationServices;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
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
    private readonly IFileStorageManager _fileStorageManager;
    private readonly ILogger<CompleteVideoUploadJob> _logger;
    private readonly INotificationService _notificationService;
    private readonly StorageOptions _storageOptions;

    public CompleteVideoUploadJob(
        CourseMateDbContext dbContext,
        IFileStorageManager fileStorageManager,
        ILogger<CompleteVideoUploadJob> logger,
        INotificationService notificationService,
        IOptions<StorageOptions> storageOptions)
    {
        _dbContext = dbContext;
        _fileStorageManager = fileStorageManager;
        _logger = logger;
        _notificationService = notificationService;
        _storageOptions = storageOptions.Value;
    }

    [AutomaticRetry(Attempts = 0)]
    public async Task ExecuteAsync(Guid fileId, Guid userId, Guid? lessonId, string baseUrl, CancellationToken ct)
    {
        FileEntry? fileEntry = await _dbContext.FileEntries.FirstOrDefaultAsync(f => f.Id == fileId && f.Status == FileStatus.Uploading, ct);
        if (fileEntry == null)
        {
            _logger.LogWarning("Video upload file entry not found or not uploading. FileId={FileId}, UserId={UserId}", fileId, userId);
            return;
        }

        _logger.LogInformation(
            "Start merging video chunks. FileId={FileId}, UserId={UserId}, LessonId={LessonId}, BaseUrl={BaseUrl}",
            fileId,
            userId,
            lessonId,
            baseUrl);

        try
        {
            List<FileChunk> fileChunks = await _dbContext.FileChunks
                .Where(f => f.FileEntryId == fileEntry.Id)
                .OrderBy(f => f.ChunkIndex)
                .ToListAsync(ct);
            _logger.LogInformation("Loaded video chunks. FileId={FileId}, ChunkCount={ChunkCount}", fileId, fileChunks.Count);

            foreach (FileChunk chunk in fileChunks)
            {
                if (!await _fileStorageManager.ExistsAsync(StorageFileEntry.FromFileChunk(chunk), ct))
                {
                    throw new BusinessException(ErrorCode.ChunkFileMissing,
                        $"Chunk {chunk.ChunkIndex} for upload '{fileEntry.Id}' is missing.");
                }
            }

            string filePath = Path.Combine(_storageOptions.RootPath, fileEntry.FileLocation);
            string? folder = Path.GetDirectoryName(filePath);
            if (!string.IsNullOrWhiteSpace(folder) && !Directory.Exists(folder))
            {
                Directory.CreateDirectory(folder);
            }

            await using (FileStream outputStream = new(filePath, FileMode.CreateNew, FileAccess.Write))
            {
                foreach (FileChunk chunk in fileChunks)
                {
                    byte[] chunkBytes = await _fileStorageManager.ReadBytesAsync(StorageFileEntry.FromFileChunk(chunk), ct);
                    await outputStream.WriteAsync(chunkBytes, ct);
                    await _fileStorageManager.DeleteAsync(StorageFileEntry.FromFileChunk(chunk), ct);
                }
            }

            fileEntry.Status = FileStatus.Completed;
            fileEntry.CompletedAt = DateTimeOffset.UtcNow;
            fileEntry.TotalChunks = fileChunks.Count;
            fileEntry.FileSize = fileChunks.Sum(f => f.ChunkSize);
            await _dbContext.SaveChangesAsync(ct);

            string videoUrl = $"{baseUrl}/api/files/videos/stream/{fileEntry.Id}";

            if (lessonId.HasValue)
            {
                LessonVideo? existing = await _dbContext.LessonVideos.FirstOrDefaultAsync(v => v.LessonId == lessonId.Value, ct);
                if (existing != null)
                {
                    existing.VideoUrl = videoUrl;
                }
                else
                {
                    await _dbContext.LessonVideos.AddAsync(new LessonVideo(Guid.NewGuid(), lessonId.Value, videoUrl), ct);
                }

                await _dbContext.SaveChangesAsync(ct);
                _logger.LogInformation("Linked processed video to lesson. FileId={FileId}, LessonId={LessonId}, VideoUrl={VideoUrl}", fileId, lessonId.Value, videoUrl);
            }

            _logger.LogInformation("Finished merging video. FileId={FileId}, VideoUrl={VideoUrl}", fileId, videoUrl);

            await _notificationService.NotifyVideoProcessedAsync(new VideoProcessedNotificationDto
                {
                    UserId = userId,
                    FileId = fileId, FileUrl = videoUrl,
                    Success = true,
                    Message = "Video đã sẵn sàng."
                },
                ct);
            _logger.LogInformation("Sent video processed success notification. FileId={FileId}, UserId={UserId}", fileId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Video merge failed. FileId={FileId}, UserId={UserId}, LessonId={LessonId}", fileId, userId, lessonId);
            fileEntry.Status = FileStatus.Failed;
            await _dbContext.SaveChangesAsync(ct);
            await _notificationService.NotifyVideoProcessedAsync(new VideoProcessedNotificationDto
                {
                    UserId = userId,
                    FileId = fileId,
                    FileUrl = string.Empty,
                    Success = false,
                    Message = "Ghép video thất bại."
                },
                ct);
            _logger.LogInformation("Sent video processed failure notification. FileId={FileId}, UserId={UserId}", fileId, userId);
            throw;
        }
    }
}