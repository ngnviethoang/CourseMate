using CourseMate.Contracts.Options;
using Microsoft.Extensions.Options;
using OllamaSharp;
using OllamaSharp.Models;

namespace CourseMate.Application.Services.AIServices;

public class OllamaAiService : IAiService
{
    private readonly OllamaApiClient _ollamaApiClient;

    public OllamaAiService(IOptions<OllamaOptions> options)
    {
        _ollamaApiClient = new OllamaApiClient(options.Value.Url);
    }

    public async Task<ReadOnlyMemory<float>> GenerateVectorAsync(string input, CancellationToken cancellationToken)
    {
        EmbedResponse response = await _ollamaApiClient.EmbedAsync(new EmbedRequest
        {
            Model = "nomic-embed-text",
            Input = [input],
            Dimensions = 1536
        }, cancellationToken);
        return new ReadOnlyMemory<float>(response.Embeddings.FirstOrDefault());
    }

    public async Task<string> SearchAsync(string input, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<string> GenerateContentAsync(string input, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}