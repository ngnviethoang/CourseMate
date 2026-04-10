using CourseMate.Contracts.DTOs.AIGeneration;

namespace CourseMate.Application.Services.AI;

public interface IAIGenerationService
{
    Task<GeneratedLessonDto> GenerateLessonFromTextAsync(string rawContent, CancellationToken cancellationToken = default);
    Task<GeneratedLessonDto> GenerateLessonFromFileAsync(Stream fileStream, string fileName, string? additionalRawContent, CancellationToken cancellationToken = default);
}