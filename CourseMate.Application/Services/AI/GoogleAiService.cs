using CourseMate.Contracts.Options;
using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Services.AI;

public class GoogleAiService : IAiService
{
    private readonly Client _client;

    public GoogleAiService(IOptions<GoogleAiOptions> options)
    {
        _client = new Client(apiKey: options.Value.ApiKey);
    }

    public async Task<ReadOnlyMemory<float>> GenerateVectorAsync(string input, CancellationToken cancellationToken)
    {
        EmbeddingGenerationOptions options = new()
        {
            ModelId = "gemini-embedding-001",
            Dimensions = 1536
        };

        return await _client.Models
            .AsIEmbeddingGenerator()
            .GenerateVectorAsync(input, options, cancellationToken);
    }

    public async Task<string> DeepResearchAsync(string input, CancellationToken cancellationToken)
    {
        // GenerateContentConfig config = new();

        GenerateContentResponse result = await _client.Models.GenerateContentAsync(
            "deep-research-pro-preview-12-2025",
            input,
            null,
            cancellationToken);
        return result.Text ?? string.Empty;
    }

    public async Task<string> GenerateContentAsync(string input, CancellationToken cancellationToken)
    {
        // GenerateContentConfig config = new();

        GenerateContentResponse result = await _client.Models.GenerateContentAsync(
            "gemini-2.5-flash-lite",
            input,
            null,
            cancellationToken);
        return result.Text ?? string.Empty;
    }
}