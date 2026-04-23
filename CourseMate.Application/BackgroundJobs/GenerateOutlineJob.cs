using CourseMate.Application.Services.AIServices;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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

    [AutomaticRetry(Attempts = 2)]
    public async Task ExecuteAsync(Guid lessonMaterialId, CancellationToken cancellationToken)
    {
        LessonMaterial? lessonMaterial = await _dbContext.LessonMaterials.FirstOrDefaultAsync(lm => lm.Id == lessonMaterialId, cancellationToken);
        if (lessonMaterial == null)
        {
            return;
        }

        _logger.LogInformation("Start generate outline for lesson {lessonMaterialId}", lessonMaterial.LessonId);

        // 1. Create query embedding
        ReadOnlyMemory<float> embedding = await _aiService.GenerateVectorAsync("main topics, key concepts, lesson structure", cancellationToken);
        Vector queryVector = new(embedding);

        // 2. Search relevant chunks
        List<Guid> fileChunkIds = await _dbContext.FileEntryEmbeddings
            .Where(x => x.FileEntryId == lessonMaterial.DocumentFileId)
            .OrderBy(x => x.Embedding.CosineDistance(queryVector))
            .Take(10)
            .Select(x => x.FileChunkId)
            .ToListAsync(cancellationToken);

        // 3. Build context
        List<FileChunk> fileChunks = await _dbContext.FileChunks
            .Where(i => fileChunkIds.Contains(i.Id))
            .ToListAsync(cancellationToken);
        List<string> chunks = [];
        foreach (FileChunk fileChunk in fileChunks)
        {
            chunks.Add(await File.ReadAllTextAsync(fileChunk.ChunkPath, cancellationToken));
        }

        string docContext = string.Join("\n\n---\n\n", chunks);

        // 4. External research (LLM simulate search)
        string externalContext = await _aiService.SearchAsync(docContext, cancellationToken);

        // 6. Generate outline
        string outline = await _aiService.GenerateContentAsync(externalContext, cancellationToken);

        // 7. Save
        lessonMaterial.Outline = outline;
        _dbContext.LessonMaterials.Update(lessonMaterial);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Finished generate outline for lesson {LessonId}", lessonMaterial.LessonId);
    }
}