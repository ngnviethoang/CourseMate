using CourseMate.Application.Services.AIServices;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Pgvector;
using Pgvector.EntityFrameworkCore;

namespace CourseMate.Application.BackgroundJobs;

public class GenerateOutlineJob
{
    private readonly IAiService _aiService;
    private readonly CourseMateDbContext _dbContext;
    private readonly ILogger<GenerateOutlineJob> _logger;

    public GenerateOutlineJob(
        CourseMateDbContext dbContext,
        ILogger<GenerateOutlineJob> logger,
        IAiService aiService)
    {
        _dbContext = dbContext;
        _logger = logger;
        _aiService = aiService;
    }

    [AutomaticRetry(Attempts = 0)]
    public async Task ExecuteAsync(Guid lessonMaterialId, CancellationToken ct)
    {
        LessonMaterial? lessonMaterial = await _dbContext.LessonMaterials.FirstOrDefaultAsync(lm => lm.Id == lessonMaterialId, ct);
        if (lessonMaterial == null)
        {
            return;
        }

        _logger.LogInformation("Start generate outline for lesson {lessonMaterialId}", lessonMaterial.LessonId);

        // 1. Create query embedding
        ReadOnlyMemory<float> embedding = await _aiService.GenerateVectorAsync("main topics, key concepts, lesson structure", ct);
        Vector queryVector = new(embedding);

        // 2. Search relevant chunks
        List<Guid> fileChunkIds = await _dbContext.FileEntryEmbeddings
            .Where(x => x.FileEntryId == lessonMaterial.DocumentFileId)
            .OrderBy(x => x.Embedding.CosineDistance(queryVector))
            .Take(10)
            .Select(x => x.FileChunkId)
            .ToListAsync(ct);
        if (fileChunkIds.Count == 0)
        {
            fileChunkIds = await _dbContext.FileEntryEmbeddings
                .Where(x => x.FileEntryId == lessonMaterial.DocumentFileId)
                .Select(x => x.FileChunkId)
                .ToListAsync(ct);
        }

        // 3. Build context
        List<FileChunk> fileChunks = await _dbContext.FileChunks
            .Where(i => fileChunkIds.Contains(i.Id))
            .ToListAsync(ct);
        List<string> chunks = [];
        foreach (FileChunk fileChunk in fileChunks)
        {
            chunks.Add(await File.ReadAllTextAsync(fileChunk.ChunkPath, ct));
        }

        string docContext = string.Join("\n\n---\n\n", chunks);

        // 4. External research (LLM simulate search)
        string externalContext = await _aiService.SearchAsync(docContext, ct);

        // 6. Generate outline
        string outline = await _aiService.GenerateContentAsync(externalContext, ct);
        outline = outline.Replace("```json", "").Replace("```", "").Trim();
        try
        {
            LectureOutline? parsedOutline = JsonConvert.DeserializeObject<LectureOutline>(outline);
            bool isValid = parsedOutline != null && !string.IsNullOrWhiteSpace(parsedOutline.LessonTitle) && parsedOutline?.Slides != null && parsedOutline.Slides.Any();
            if (!isValid)
            {
                _logger.LogWarning("Invalid AI outline structure for lesson {LessonId}. Raw output: {Outline}", lessonMaterial.LessonId, outline);
            }
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Failed to parse AI outline for lesson {LessonId}. Raw output: {Outline}", lessonMaterial.LessonId, outline);
            throw new BusinessException($"Invalid AI outline for lesson {lessonMaterial.LessonId}", ex);
        }


        lessonMaterial.Outline = outline;
        _dbContext.LessonMaterials.Update(lessonMaterial);
        await _dbContext.SaveChangesAsync(ct);
        _logger.LogInformation("Finished generate outline for lesson {LessonId}", lessonMaterial.LessonId);
    }
}