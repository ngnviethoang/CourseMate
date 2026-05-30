using System.Text;
using System.Text.RegularExpressions;
using CourseMate.Application.Services.AIServices;
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

public class ProcessFileEmbeddingJob
{
    private readonly IAiService _aIService;
    private readonly CourseMateDbContext _dbContext;
    private readonly ILogger<ProcessFileEmbeddingJob> _logger;
    private readonly StorageOptions _storageOptions;

    public ProcessFileEmbeddingJob(
        CourseMateDbContext dbContext,
        IOptions<StorageOptions> storageOptions,
        ILogger<ProcessFileEmbeddingJob> logger,
        IAiService aIService)
    {
        _dbContext = dbContext;
        _logger = logger;
        _aIService = aIService;
        _storageOptions = storageOptions.Value;
    }

    [AutomaticRetry(Attempts = 0)]
    public async Task ExecuteAsync(Guid fileId, CancellationToken ct)
    {
        _logger.LogInformation("Starting ProcessFileEmbeddingJob for file ID: {FileId}", fileId);
        FileEntry? fileEntry = await _dbContext.FileEntries.FirstOrDefaultAsync(i => i.Id == fileId, ct);
        if (fileEntry == null)
        {
            _logger.LogWarning("File entry not found for ID: {FileId}", fileId);
            return;
        }

        if (!File.Exists(Path.Combine(_storageOptions.RootPath, fileEntry.FileLocation)))
        {
            _logger.LogWarning("File does not exist at path: {FilePath} for file ID: {FileId}", fileEntry.FileLocation, fileId);
            return;
        }

        string fileExtension = Path.GetExtension(fileEntry.FileName).ToLowerInvariant();
        if (fileExtension is ".doc" or ".docx" or ".pdf" or ".txt")
        {
            _logger.LogInformation("Reading file content for: {FileName} (FileID: {FileId})", fileEntry.FileName, fileId);
            // NOTE: ReadAllTextAsync may not work properly for binary files like .pdf/.docx without a library.
            // This seems to be the current implementation, logging it clearly.
            string content = ReadWordText(fileEntry.FileLocation);

            IEnumerable<Chunk> chunks = ChunkSentences(content);
            int chunkCount = 1;
            string tempDir = Path.Combine(_storageOptions.TempPath, fileEntry.FileLocation);

            foreach (Chunk chunk in chunks)
            {
                _logger.LogDebug("Generating embedding for chunk {ChunkIndex} of file {FileId}", chunkCount, fileId);
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

            LessonMaterial? lessonMaterial = await _dbContext.LessonMaterials
                .Where(lm => lm.DocumentFileId == fileId)
                .OrderByDescending(lm => lm.CreationTime)
                .FirstOrDefaultAsync(ct);
            if (lessonMaterial != null)
            {
                lessonMaterial.Status = LessonMaterialState.GeneratingOutline;
                _dbContext.LessonMaterials.Update(lessonMaterial);
            }

            await _dbContext.SaveChangesAsync(ct);
            _logger.LogInformation("Successfully processed file {FileId} with {ChunkCount} embeddings.", fileId, chunkCount);
        }
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
