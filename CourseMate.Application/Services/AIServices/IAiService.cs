using CourseMate.Contracts.Enums;

namespace CourseMate.Application.Services.AIServices;

public interface IAiService
{
    Task<ReadOnlyMemory<float>> GenerateVectorAsync(string input, CancellationToken ct);

    Task<string> SearchAsync(string input, CancellationToken ct);

    Task<string> GenerateContentAsync(string input, LessonMaterialPromptType promptType, CancellationToken ct);
}