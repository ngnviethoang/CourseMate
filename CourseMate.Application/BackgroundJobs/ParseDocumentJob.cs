using System.Text.Json;
using CourseMate.Application.Services.WordParserServices;
using CourseMate.Contracts.DTOs.Services.WordParserServices;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CourseMate.Application.BackgroundJobs;

public class ParseDocumentJob
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly CourseMateDbContext _dbContext;
    private readonly ILogger<ParseDocumentJob> _logger;
    private readonly IWordParserService _wordParserService;

    public ParseDocumentJob(
        CourseMateDbContext dbContext,
        IWordParserService wordParserService,
        IBackgroundJobClient backgroundJobClient,
        ILogger<ParseDocumentJob> logger)
    {
        _dbContext = dbContext;
        _wordParserService = wordParserService;
        _backgroundJobClient = backgroundJobClient;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 2)]
    public async Task ExecuteAsync(Guid materialId, CancellationToken cancellationToken)
    {
        _logger.LogInformation("ParseDocumentJob started for MaterialId: {MaterialId}", materialId);

        LessonMaterial? material = await _dbContext.LessonMaterials.FirstOrDefaultAsync(m => m.Id == materialId, cancellationToken);

        if (material is null)
        {
            _logger.LogWarning("Material {MaterialId} not found", materialId);
            return;
        }

        try
        {
            // Update status to Parsing
            material.Status = DocumentProcessingStatus.Parsing;
            await _dbContext.SaveChangesAsync(cancellationToken);

            // Parse the Word document
            ParsedDocument parsedDoc = await _wordParserService.ParseAsync(material.DocumentFilePath, cancellationToken);
            material.ParsedContent = JsonSerializer.Serialize(parsedDoc, JsonOptions);
            material.Status = DocumentProcessingStatus.Parsed;
            await _dbContext.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Document parsed successfully for MaterialId: {MaterialId}", materialId);

            // Chain: enqueue outline generation
            string jobId = BackgroundJob.Enqueue<GenerateOutlineJob>(job => job.ExecuteAsync(materialId, CancellationToken.None));
            material.HangfireJobId = jobId;
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            material.Status = DocumentProcessingStatus.Failed;
            _logger.LogError(ex, "Failed to parse document for MaterialId: {MaterialId}", materialId);
            await _dbContext.SaveChangesAsync(cancellationToken);
            throw;
        }
    }
}