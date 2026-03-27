using System.Text.Json;
using CourseMate.Application.Services.AiResearchServices;
using CourseMate.Contracts.DTOs.Instructors;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CourseMate.Application.BackgroundJobs;

public class GenerateOutlineJob
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    private readonly IAiResearchService _aiResearchService;
    private readonly CourseMateDbContext _dbContext;
    private readonly ILogger<GenerateOutlineJob> _logger;

    public GenerateOutlineJob(
        CourseMateDbContext dbContext,
        IAiResearchService aiResearchService,
        ILogger<GenerateOutlineJob> logger)
    {
        _dbContext = dbContext;
        _aiResearchService = aiResearchService;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 2)]
    public async Task ExecuteAsync(Guid materialId, CancellationToken cancellationToken)
    {
        _logger.LogInformation("GenerateOutlineJob started for MaterialId: {MaterialId}", materialId);

        LessonMaterial? material = await _dbContext.LessonMaterials.FirstOrDefaultAsync(m => m.Id == materialId, cancellationToken);

        if (material is null)
        {
            _logger.LogWarning("Material {MaterialId} not found", materialId);
            return;
        }

        if (string.IsNullOrEmpty(material.ParsedContent))
        {
            _logger.LogWarning("Material {MaterialId} has no parsed content", materialId);
            material.Status = DocumentProcessingStatus.Failed;
            await _dbContext.SaveChangesAsync(cancellationToken);
            return;
        }

        try
        {
            // Update status
            material.Status = DocumentProcessingStatus.GeneratingOutline;
            await _dbContext.SaveChangesAsync(cancellationToken);

            // Call AI
            List<OutlineSectionDto> outline = await _aiResearchService.GenerateOutlineAsync(material.ParsedContent, cancellationToken);

            // Save outline
            material.Outline = JsonSerializer.Serialize(outline, JsonOptions);
            material.Status = DocumentProcessingStatus.OutlineReady;
            await _dbContext.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Outline generated with {SectionCount} sections for MaterialId: {MaterialId}", outline.Count, materialId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate outline for MaterialId: {MaterialId}", materialId);
            material.Status = DocumentProcessingStatus.Failed;
            await _dbContext.SaveChangesAsync(cancellationToken);
            throw;
        }
    }
}