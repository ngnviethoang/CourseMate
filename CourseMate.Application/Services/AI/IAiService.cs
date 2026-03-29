namespace CourseMate.Application.Services.AI;

public interface IAiService
{
    Task<ReadOnlyMemory<float>> GenerateVectorAsync(string input, CancellationToken cancellationToken);

    Task<string> DeepResearchAsync(string input, CancellationToken cancellationToken);

    Task<string> GenerateContentAsync(string input, CancellationToken cancellationToken);
}