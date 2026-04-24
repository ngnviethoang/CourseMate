namespace CourseMate.Application.Services.AIServices;

public interface IAiService
{
    Task<ReadOnlyMemory<float>> GenerateVectorAsync(string input, CancellationToken cancellationToken);

    Task<string> SearchAsync(string input, CancellationToken cancellationToken);

    Task<string> GenerateContentAsync(string input, CancellationToken cancellationToken);
}