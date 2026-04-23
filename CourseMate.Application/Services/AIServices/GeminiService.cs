using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using Google;
using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Services.AIServices;

public class GeminiService : IAiService
{
    private readonly Client _client;
    private readonly ILogger<GeminiService> _logger;

    public GeminiService(IOptions<GoogleAiOptions> options, ILogger<GeminiService> logger)
    {
        _logger = logger;
        _client = new Client(apiKey: options.Value.ApiKey);
    }

    public async Task<ReadOnlyMemory<float>> GenerateVectorAsync(string input, CancellationToken cancellationToken)
    {
        try
        {
            EmbeddingGenerationOptions options = new()
            {
                ModelId = GeminiModels.Embedding001,
                Dimensions = 1536
            };

            return await _client.Models.AsIEmbeddingGenerator().GenerateVectorAsync(input, options, cancellationToken);
        }
        catch (GoogleApiException ex)
        {
            _logger.LogError(ex, "Gemini embedding failed");
            throw new BusinessException(ErrorMessages.EmbeddingFailed, ex);
        }
    }

    public async Task<string> SearchAsync(string input, CancellationToken cancellationToken)
    {
        string prompt = PromptBuilder.BuildResearchPrompt(input);
        try
        {
            // Strict search
            GenerateContentConfig config = new()
            {
                Temperature = 0.0,
                TopP = 0.9,
                TopK = 20,
                MaxOutputTokens = 1024,
                ThinkingConfig = new ThinkingConfig
                {
                    IncludeThoughts = false
                    // ThinkingLevel = ThinkingLevel.Medium
                },
                Tools = [new Tool { GoogleSearch = new GoogleSearch() }]
            };
            GenerateContentResponse result = await _client.Models.GenerateContentAsync(GeminiModels.V25FlashLite, prompt, config, cancellationToken);
            return result.Text ?? string.Empty;
        }
        catch (GoogleApiException ex)
        {
            _logger.LogError(ex, "Gemini research request failed");
            throw new BusinessException(ErrorMessages.ResearchGenerationFailed, ex);
        }
    }

    public async Task<string> GenerateContentAsync(string input, CancellationToken cancellationToken)
    {
        string prompt = PromptBuilder.BuildLectureOutlinePrompt(input);
        try
        {
            GenerateContentConfig config = new()
            {
                Temperature = 0.2,
                TopP = 0.9,
                TopK = 20,
                MaxOutputTokens = 1024,
                ThinkingConfig = new ThinkingConfig
                {
                    IncludeThoughts = false
                    // ThinkingLevel = ThinkingLevel.Medium
                }
            };

            GenerateContentResponse result = await _client.Models.GenerateContentAsync(GeminiModels.V25FlashLite, prompt, config, cancellationToken);
            return result.Text ?? string.Empty;
        }
        catch (GoogleApiException ex)
        {
            _logger.LogError(ex, "Gemini lecture outline request failed");
            throw new BusinessException(ErrorMessages.LectureOutlineGenerationFailed, ex);
        }
    }
}