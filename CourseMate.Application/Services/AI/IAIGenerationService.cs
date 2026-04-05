using System.Threading;
using System.Threading.Tasks;
using CourseMate.Contracts.DTOs.AIGeneration;

namespace CourseMate.Application.Services.AI;

public interface IAIGenerationService
{
    Task<GeneratedLessonDto> GenerateLessonFromTextAsync(string rawContent, CancellationToken cancellationToken = default);
    Task<GeneratedLessonDto> GenerateLessonFromFileAsync(System.IO.Stream fileStream, string fileName, string? additionalRawContent, CancellationToken cancellationToken = default);
}
