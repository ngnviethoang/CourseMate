using System.Text.Json;
using CourseMate.Application.Services.AiResearchServices;
using CourseMate.Application.Services.SlideGeneratorServices;
using CourseMate.Contracts.DTOs.Instructors;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.BackgroundJobs;

public class GenerateSlideJob
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    private readonly IAiResearchService _aiResearchService;
    private readonly CourseMateDbContext _dbContext;
    private readonly ILogger<GenerateSlideJob> _logger;
    private readonly ISlideGeneratorService _slideGeneratorService;
    private readonly StorageOptions _storageOptions;

    public GenerateSlideJob(
        CourseMateDbContext dbContext,
        IAiResearchService aiResearchService,
        ISlideGeneratorService slideGeneratorService,
        IOptions<StorageOptions> storageOptions,
        ILogger<GenerateSlideJob> logger)
    {
        _dbContext = dbContext;
        _aiResearchService = aiResearchService;
        _slideGeneratorService = slideGeneratorService;
        _storageOptions = storageOptions.Value;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 2)]
    public async Task ExecuteAsync(Guid materialId, CancellationToken cancellationToken)
    {
        _logger.LogInformation("GenerateSlideJob started for MaterialId: {MaterialId}", materialId);

        LessonMaterial? material = await _dbContext.LessonMaterials.FirstOrDefaultAsync(m => m.Id == materialId, cancellationToken);

        if (material is null)
        {
            _logger.LogWarning("Material {MaterialId} not found", materialId);
            return;
        }

        if (string.IsNullOrEmpty(material.Outline))
        {
            _logger.LogWarning("Material {MaterialId} has no outline", materialId);
            material.Status = DocumentProcessingStatus.Failed;
            await _dbContext.SaveChangesAsync(cancellationToken);
            return;
        }

        try
        {
            // Update status
            material.Status = DocumentProcessingStatus.GeneratingSlide;
            await _dbContext.SaveChangesAsync(cancellationToken);

            // Enhance outline with AI for slide-ready content
            List<OutlineSectionDto> slideContent = await _aiResearchService.GenerateSlideContentAsync(material.Outline, cancellationToken);

            // Get lesson title
            Lesson? lesson = await _dbContext.Lessons.FirstOrDefaultAsync(l => l.Id == material.LessonId, cancellationToken);
            string title = lesson?.Title ?? "Presentation";

            // Generate .pptx file
            string fileName = $"{materialId:N}.pptx";
            string outputPath = Path.Combine(_storageOptions.DocumentsPath, fileName);

            await _slideGeneratorService.GenerateAsync(title, slideContent, outputPath, cancellationToken);

            // Update material
            material.SlideFilePath = outputPath;
            material.Outline = JsonSerializer.Serialize(slideContent, JsonOptions);
            material.Status = DocumentProcessingStatus.SlideReady;
            await _dbContext.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Slide generated at {OutputPath} for MaterialId: {MaterialId}", outputPath, materialId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate slide for MaterialId: {MaterialId}", materialId);
            material.Status = DocumentProcessingStatus.Failed;
            await _dbContext.SaveChangesAsync(cancellationToken);
            throw;
        }
    }
}