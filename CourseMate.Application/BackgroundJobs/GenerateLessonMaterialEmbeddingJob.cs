using System.Text;
using System.Text.RegularExpressions;
using CourseMate.Application.Services.AIServices;
using CourseMate.Application.Services.NotificationServices;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pgvector;

namespace CourseMate.Application.BackgroundJobs;

public class GenerateLessonMaterialEmbeddingJob
{
    private readonly IAiService _aIService;
    private readonly CourseMateDbContext _dbContext;
    private readonly ILogger<GenerateLessonMaterialEmbeddingJob> _logger;
    private readonly INotificationService _notificationService;
    private readonly StorageOptions _storageOptions;

    public GenerateLessonMaterialEmbeddingJob(
        CourseMateDbContext dbContext,
        IOptions<StorageOptions> storageOptions,
        ILogger<GenerateLessonMaterialEmbeddingJob> logger,
        IAiService aIService,
        INotificationService notificationService)
    {
        _dbContext = dbContext;
        _logger = logger;
        _aIService = aIService;
        _notificationService = notificationService;
        _storageOptions = storageOptions.Value;
    }

    [AutomaticRetry(Attempts = 0)]
    public async Task ExecuteAsync(Guid lessonMaterialId, CancellationToken ct)
    {
        _logger.LogInformation("Starting GenerateLessonMaterialEmbeddingJob for lesson material ID: {LessonMaterialId}", lessonMaterialId);
        LessonMaterial? lessonMaterial = await _dbContext.LessonMaterials.FirstOrDefaultAsync(i => i.Id == lessonMaterialId, ct);
        if (lessonMaterial == null)
        {
            _logger.LogWarning("Lesson material not found for ID: {LessonMaterialId}", lessonMaterialId);
            return;
        }

        FileEntry? fileEntry = await _dbContext.FileEntries.FirstOrDefaultAsync(i => i.Id == lessonMaterial.DocumentFileId, ct);
        if (fileEntry == null)
        {
            _logger.LogWarning("File entry not found for lesson material ID: {LessonMaterialId}, file ID: {FileId}", lessonMaterialId, lessonMaterial.DocumentFileId);
            await MarkFailedAndNotifyAsync(lessonMaterial, "Không tìm thấy tài liệu nguồn để tạo slide.", ct);
            throw new InvalidOperationException($"File entry not found for lesson material {lessonMaterialId}.");
        }

        string physicalFilePath = Path.Combine(_storageOptions.RootPath, fileEntry.FileLocation);
        if (!File.Exists(physicalFilePath))
        {
            _logger.LogWarning("File does not exist at path: {FilePath} for file ID: {FileId}", fileEntry.FileLocation, lessonMaterialId);
            await MarkFailedAndNotifyAsync(lessonMaterial, "Tệp tài liệu nguồn không còn tồn tại.", ct);
            throw new FileNotFoundException("Source file for lesson material was not found.", physicalFilePath);
        }

        string fileExtension = Path.GetExtension(fileEntry.FileName).ToLowerInvariant();
        if (fileExtension is not ".doc" and not ".docx" and not ".pdf" and not ".txt")
        {
            _logger.LogWarning("Unsupported file type {FileExtension} for lesson material ID: {LessonMaterialId}", fileExtension, lessonMaterialId);
            await MarkFailedAndNotifyAsync(lessonMaterial, "Định dạng tài liệu chưa được hỗ trợ để tạo slide.", ct);
            throw new InvalidOperationException($"Unsupported file type {fileExtension} for lesson material {lessonMaterialId}.");
        }

        try
        {
            _logger.LogInformation("Reading file content for: {FileName} (FileID: {FileId})", fileEntry.FileName, lessonMaterialId);
            string content = ReadWordText(physicalFilePath);
            _logger.LogInformation("Read source content. LessonMaterialId={LessonMaterialId}, ContentLength={ContentLength}", lessonMaterialId, content.Length);
            IEnumerable<Chunk> chunks = ChunkSentences(content);
            int chunkCount = 1;
            foreach (Chunk chunk in chunks)
            {
                _logger.LogDebug("Generating embedding for chunk {ChunkIndex} of file {FileId}", chunkCount, lessonMaterialId);
                string chunkFileName = $"{fileEntry.Id}_chunk{chunkCount}.txt";
                string chunkFilePath = Path.Combine(_storageOptions.TempPath, chunkFileName);
                await using FileStream stream = new(chunkFilePath, FileMode.CreateNew, FileAccess.Write, FileShare.None);
                await stream.WriteAsync(Encoding.UTF8.GetBytes(chunk.Content), ct);
                FileChunk fileChunk = new(Guid.NewGuid(), fileEntry.Id, chunkCount, chunkFilePath, chunk.Content.Length, true);
                await _dbContext.FileChunks.AddAsync(fileChunk, ct);

                ReadOnlyMemory<float> embedding = await _aIService.GenerateVectorAsync(chunk.Content, ct);
                FileEntryEmbedding fileEntryEmbedding = new(
                    Guid.NewGuid(),
                    fileEntry.Id,
                    fileChunk.Id,
                    chunk.StartIndex,
                    chunk.EndIndex,
                    Left(chunk.Content, 100),
                    new Vector(embedding)
                );
                await _dbContext.FileEntryEmbeddings.AddAsync(fileEntryEmbedding, ct);
                chunkCount++;
            }

            fileEntry.TotalChunks = chunkCount;
            fileEntry.UploadedChunks = chunkCount;
            _dbContext.FileEntries.Update(fileEntry);

            lessonMaterial.Status = LessonMaterialState.GeneratingOutline;
            _dbContext.LessonMaterials.Update(lessonMaterial);

            await _dbContext.SaveChangesAsync(ct);
            _logger.LogInformation("Successfully processed file {FileId} with {ChunkCount} embeddings.", lessonMaterialId, chunkCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate embeddings for lesson material ID: {LessonMaterialId}", lessonMaterialId);
            await MarkFailedAndNotifyAsync(lessonMaterial, "Tạo dữ liệu phân tích cho slide thất bại.", ct);
            throw;
        }
    }

    private async Task MarkFailedAndNotifyAsync(LessonMaterial lessonMaterial, string message, CancellationToken ct)
    {
        lessonMaterial.Status = LessonMaterialState.Failed;
        _dbContext.LessonMaterials.Update(lessonMaterial);
        await _dbContext.SaveChangesAsync(ct);

        if (!lessonMaterial.UserId.HasValue)
        {
            _logger.LogWarning("Skip failure notification because lesson material has no user. LessonMaterialId={LessonMaterialId}", lessonMaterial.Id);
            return;
        }

        await _notificationService.NotifyDocumentProcessedAsync(
            new NotificationDto
            {
                Id = Guid.NewGuid(),
                ReceiverId = lessonMaterial.UserId.Value,
                LessonId = lessonMaterial.LessonId,
                Title = "Document processed",
                Message = message,
                IsRead = false,
                CreationTime = DateTimeOffset.UtcNow
            },
            ct);
        _logger.LogInformation("Sent embedding failure notification. LessonMaterialId={LessonMaterialId}, LessonId={LessonId}", lessonMaterial.Id, lessonMaterial.LessonId);
    }

    private static string ReadWordText(string filePath)
    {
        using WordprocessingDocument doc = WordprocessingDocument.Open(filePath, false);
        Body? body = doc.MainDocumentPart?.Document?.Body;

        if (body == null)
        {
            return string.Empty;
        }

        return NormalizeText(body.InnerText);
    }

    private static string NormalizeText(string input)
    {
        if (string.IsNullOrEmpty(input))
        {
            return string.Empty;
        }

        input = input.Normalize(NormalizationForm.FormKC);
        input = Regex.Replace(input, @"[ \t]+", " ");
        input = Regex.Replace(input, @"\r\n|\r|\n", "\n");
        return input.Trim();
    }

    private static IEnumerable<Chunk> ChunkSentences(string text, int maxTokens = 800)
    {
        // Split text into sentences while preserving their original positions
        MatchCollection sentenceMatches = Regex.Matches(text, @"[^\.!\?]*[\.!\?]\s*");
        List<Chunk> sentences = [];

        int lastEnd = 0;
        foreach (Match match in sentenceMatches)
        {
            sentences.Add(new Chunk
            {
                Content = match.Value,
                StartIndex = match.Index,
                EndIndex = match.Index + match.Length - 1
            });
            lastEnd = match.Index + match.Length;
        }

        // Handle any remaining text that doesn't end with sentence punctuation
        if (lastEnd < text.Length)
        {
            string remaining = text[lastEnd..];
            if (!string.IsNullOrWhiteSpace(remaining))
            {
                sentences.Add(new Chunk
                    {
                        Content = remaining,
                        StartIndex = lastEnd,
                        EndIndex = text.Length - 1
                    }
                );
            }
        }

        StringBuilder current = new();
        int tokenCount = 0;
        int chunkStartIndex = -1;
        int chunkEndIndex = -1;

        foreach (Chunk sentence in sentences)
        {
            int sentenceTokens = sentence.Content.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;

            if (tokenCount + sentenceTokens > maxTokens && current.Length > 0)
            {
                yield return new Chunk
                {
                    Content = current.ToString().Trim(),
                    StartIndex = chunkStartIndex,
                    EndIndex = chunkEndIndex
                };

                current.Clear();
                tokenCount = 0;
                chunkStartIndex = -1;
            }

            if (current.Length == 0)
            {
                chunkStartIndex = sentence.StartIndex;
            }

            current.Append(sentence.Content);
            tokenCount += sentenceTokens;
            chunkEndIndex = sentence.EndIndex;
        }

        if (current.Length > 0)
        {
            yield return new Chunk
            {
                Content = current.ToString().Trim(),
                StartIndex = chunkStartIndex,
                EndIndex = chunkEndIndex
            };
        }
    }

    private static string Left(string value, int length)
    {
        return string.IsNullOrEmpty(value) ? value : value[..Math.Min(value.Length, length)];
    }

    private sealed class Chunk
    {
        public required string Content { get; init; }
        public required int StartIndex { get; init; }
        public required int EndIndex { get; init; }
    }
}