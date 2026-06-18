using CourseMate.Application.Services.FileStorageServices;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pgvector;
using Pgvector.EntityFrameworkCore;

namespace CourseMate.Application.Services.AIServices;

public sealed class ChatRetrievalService : IChatRetrievalService
{
    private readonly CourseMateReadOnlyDbContext _dbContext;
    private readonly IFileStorageManager _fileStorageManager;
    private readonly ILogger<ChatRetrievalService> _logger;

    public ChatRetrievalService(
        CourseMateReadOnlyDbContext dbContext,
        IFileStorageManager fileStorageManager,
        ILogger<ChatRetrievalService> logger)
    {
        _dbContext = dbContext;
        _fileStorageManager = fileStorageManager;
        _logger = logger;
    }

    public async Task<IReadOnlyList<RetrievedChunk>> RetrieveAsync(
        ReadOnlyMemory<float> queryVector,
        Guid? courseId,
        Guid? lessonId,
        int topK,
        CancellationToken ct)
    {
        Vector embedding = new(queryVector);
        IQueryable<FileEntryEmbedding> query = _dbContext.FileEntryEmbeddings;

        if (lessonId.HasValue)
        {
            IQueryable<Guid> fileIds = _dbContext.LessonMaterials
                .Where(m => m.LessonId == lessonId.Value)
                .Select(m => m.DocumentFileId);
            query = query.Where(e => fileIds.Contains(e.FileEntryId));
        }
        else if (courseId.HasValue)
        {
            IQueryable<Guid> fileIds = from material in _dbContext.LessonMaterials
                join lesson in _dbContext.Lessons on material.LessonId equals lesson.Id
                where lesson.CourseId == courseId.Value
                select material.DocumentFileId;
            query = query.Where(e => fileIds.Contains(e.FileEntryId));
        }

        List<ChunkHit> hits = await query
            .OrderBy(e => e.Embedding.CosineDistance(embedding))
            .Take(topK)
            .Select(e => new ChunkHit(e.FileEntryId, e.FileChunkId, e.ShortText, e.Embedding.CosineDistance(embedding)))
            .ToListAsync(ct);

        if (hits.Count == 0)
        {
            return [];
        }

        List<Guid> chunkIds = hits.Select(h => h.FileChunkId).ToList();
        Dictionary<Guid, FileChunk> chunks = await _dbContext.FileChunks
            .Where(c => chunkIds.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id, ct);

        List<RetrievedChunk> results = [];
        foreach (ChunkHit hit in hits)
        {
            string text = hit.ShortText;
            if (chunks.TryGetValue(hit.FileChunkId, out FileChunk? chunk))
            {
                text = await ReadChunkTextAsync(chunk, hit.ShortText, ct);
            }

            results.Add(new RetrievedChunk(hit.FileEntryId, hit.FileChunkId, text, hit.ShortText, hit.Distance));
        }

        return results;
    }

    private async Task<string> ReadChunkTextAsync(FileChunk chunk, string fallback, CancellationToken ct)
    {
        try
        {
            StorageFileEntry storageEntry = StorageFileEntry.FromFileChunk(chunk);
            if (!await _fileStorageManager.ExistsAsync(storageEntry, ct))
            {
                return fallback;
            }

            await using Stream stream = await _fileStorageManager.ReadAsync(storageEntry, ct);
            using StreamReader reader = new(stream);
            return await reader.ReadToEndAsync(ct);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to read chunk text from storage. FileChunkId={FileChunkId}", chunk.Id);
            return fallback;
        }
    }

    private sealed record ChunkHit(Guid FileEntryId, Guid FileChunkId, string ShortText, double Distance);
}
