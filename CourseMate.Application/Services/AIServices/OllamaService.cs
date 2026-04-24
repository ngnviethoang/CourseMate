using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OllamaSharp;
using OllamaSharp.Models;
using OllamaSharp.Models.Exceptions;

namespace CourseMate.Application.Services.AIServices;

public class OllamaService : IAiService
{
    private readonly OllamaApiClient _ollamaApiClient;
    private readonly ILogger<OllamaService> _logger;

    public OllamaService(
        IOptions<OllamaOptions> options,
        ILogger<OllamaService> logger)
    {
        _logger = logger;
        _ollamaApiClient = new OllamaApiClient(options.Value.Url);
    }

    public async Task<ReadOnlyMemory<float>> GenerateVectorAsync(string input, CancellationToken cancellationToken)
    {
        try
        {
            EmbedResponse response = await _ollamaApiClient.EmbedAsync(new EmbedRequest
            {
                Model = OllamaModels.NomicEmbedText,
                Input = [input],
                Dimensions = 768
            }, cancellationToken);

            float[]? vector = response.Embeddings.FirstOrDefault();
            return new ReadOnlyMemory<float>(vector);
        }
        catch (OllamaException ex)
        {
            _logger.LogError(ex, "Ollama embedding failed");
            throw new BusinessException(ErrorMessages.EmbeddingFailed, ex);
        }
    }

    public async Task<string> SearchAsync(string input, CancellationToken cancellationToken)
    {
        string prompt = PromptBuilder.BuildResearchPrompt(input);
        try
        {
            IChatClient chatClient = _ollamaApiClient;

            ChatResponse response = await chatClient.GetResponseAsync(prompt, new ChatOptions
            {
                ModelId = OllamaModels.Llama3,
                Temperature = 0.0f,
                MaxOutputTokens = 1024
            }, cancellationToken);
            return response.Text;
        }
        catch (OllamaException ex)
        {
            _logger.LogError(ex, "Ollama research request failed");
            throw new BusinessException(ErrorMessages.ResearchGenerationFailed, ex);
        }
    }

    public async Task<string> GenerateContentAsync(
        string input,
        CancellationToken cancellationToken)
    {
        string prompt = PromptBuilder.BuildLectureOutlinePrompt(input);

        try
        {
            IChatClient chatClient = _ollamaApiClient;

            ChatResponse response = await chatClient.GetResponseAsync(prompt, new ChatOptions
            {
                ModelId = OllamaModels.Llama3,
                Temperature = 0.2f,
                MaxOutputTokens = 4096
            }, cancellationToken);

            return response.Text;
        }

        catch (Exception ex)
        {
            _logger.LogError(ex, "Ollama lecture outline request failed");
            throw new BusinessException(ErrorMessages.LectureOutlineGenerationFailed, ex);
        }
    }
}