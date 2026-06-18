using CourseMate.Application.Services.AIServices;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pgvector;

namespace CourseMate.Application.BackgroundJobs;

public class GenerateCourseEmbeddingJob
{
    private readonly IAiService _aiService;
    private readonly CourseMateDbContext _dbContext;
    private readonly ILogger<GenerateCourseEmbeddingJob> _logger;

    public GenerateCourseEmbeddingJob(
        CourseMateDbContext dbContext,
        IAiService aiService,
        ILogger<GenerateCourseEmbeddingJob> logger)
    {
        _dbContext = dbContext;
        _aiService = aiService;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 1)]
    public async Task ExecuteAsync(Guid courseId, CancellationToken ct)
    {
        Course? course = await _dbContext.Courses.FirstOrDefaultAsync(c => c.Id == courseId, ct);
        if (course == null)
        {
            _logger.LogWarning("Course not found for embedding generation. CourseId={CourseId}", courseId);
            return;
        }

        string? categoryName = await _dbContext.Categories
            .Where(c => c.Id == course.CategoryId)
            .Select(c => c.Name)
            .FirstOrDefaultAsync(ct);

        string text = $"{course.Title}\n{course.Description}\nCategory: {categoryName}";
        ReadOnlyMemory<float> vector = await _aiService.GenerateVectorAsync(text, ct);

        CourseEmbedding? existing = await _dbContext.CourseEmbeddings.FirstOrDefaultAsync(e => e.CourseId == courseId, ct);
        if (existing == null)
        {
            CourseEmbedding embedding = new(Guid.NewGuid(), courseId, new Vector(vector));
            await _dbContext.CourseEmbeddings.AddAsync(embedding, ct);
        }
        else
        {
            existing.Embedding = new Vector(vector);
            _dbContext.CourseEmbeddings.Update(existing);
        }

        await _dbContext.SaveChangesAsync(ct);
        _logger.LogInformation("Generated course embedding. CourseId={CourseId}", courseId);
    }
}
