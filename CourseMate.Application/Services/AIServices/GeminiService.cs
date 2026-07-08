using System.Net;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
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

    public async Task<ReadOnlyMemory<float>> GenerateVectorAsync(string input, CancellationToken ct)
    {
        EmbeddingGenerationOptions options = new()
        {
            ModelId = GeminiModels.Embedding001,
            Dimensions = 768
        };
        try
        {
            _logger.LogInformation("Calling Gemini embedding API. Model={Model}, Dimensions={Dimensions}, InputLength={InputLength}", options.ModelId, options.Dimensions, input.Length);
            ReadOnlyMemory<float> vector = await _client.Models.AsIEmbeddingGenerator().GenerateVectorAsync(input, options, ct);
            _logger.LogInformation("Gemini embedding completed successfully. Model={Model}, VectorSize={VectorSize}", options.ModelId, vector.Length);
            return vector;
        }
        catch (GoogleApiException ex)
        {
            _logger.LogError(ex, "Gemini embedding failed. StatusCode={StatusCode}", ex.HttpStatusCode);
            throw new BusinessException(ErrorCode.AiGenerationFailed, "AI generation failed.", ex);
        }
    }

    public async Task<string> SearchAsync(string input, CancellationToken ct)
    {
        string prompt = PromptBuilder.BuildResearchPrompt(input);

        GenerateContentConfig config = new()
        {
            Temperature = 0.0,
            TopP = 0.9,
            TopK = 20,
            MaxOutputTokens = 1024,
            ThinkingConfig = new ThinkingConfig
            {
                IncludeThoughts = false
            },
            Tools = [new Tool { GoogleSearch = new GoogleSearch() }]
        };

        _logger.LogInformation(
            "Starting Gemini search generation. InputLength={InputLength}, PromptLength={PromptLength}, PrimaryModel={PrimaryModel}, FallbackModel={FallbackModel}",
            input.Length,
            prompt.Length,
            GeminiModels.V25Flash,
            GeminiModels.V25FlashLite);

        return await GenerateWithFallbackAsync(prompt, config, GeminiModels.V25Flash, GeminiModels.V25FlashLite, ct);
    }

    public async Task<string> GenerateContentAsync(string input, LessonMaterialPromptType promptType, CancellationToken ct)
    {
        string prompt = promptType == LessonMaterialPromptType.Reading
            ? PromptBuilder.BuildReadingLessonOutlinePrompt(input)
            : PromptBuilder.BuildLectureOutlinePrompt(input);

        GenerateContentConfig config = new()
        {
            Temperature = 0.2,
            TopP = 0.9,
            TopK = 20,
            MaxOutputTokens = 4096,
            ThinkingConfig = new ThinkingConfig
            {
                IncludeThoughts = false
            }
        };

        _logger.LogInformation(
            "Starting Gemini content generation. PromptType={PromptType}, InputLength={InputLength}, PromptLength={PromptLength}, PrimaryModel={PrimaryModel}, FallbackModel={FallbackModel}",
            promptType,
            input.Length,
            prompt.Length,
            GeminiModels.V25Flash,
            GeminiModels.V25FlashLite);

        return await GenerateWithFallbackAsync(prompt, config, GeminiModels.V25Flash, GeminiModels.V25FlashLite, ct);
    }

    public async Task<string> ChatAsync(IReadOnlyList<ChatTurn> history, string retrievedContext, string question, CancellationToken ct)
    {
        string historyText = string.Join("\n", history.Select(turn => $"{turn.Role}: {turn.Content}"));
        string prompt = PromptBuilder.BuildChatPrompt(retrievedContext, historyText, question);

        GenerateContentConfig config = new()
        {
            Temperature = 0.2,
            TopP = 0.9,
            TopK = 20,
            MaxOutputTokens = 2048,
            ThinkingConfig = new ThinkingConfig
            {
                IncludeThoughts = false
            }
        };

        _logger.LogInformation(
            "Starting Gemini chat generation. QuestionLength={QuestionLength}, ContextLength={ContextLength}, HistoryTurns={HistoryTurns}",
            question.Length,
            retrievedContext.Length,
            history.Count);

        return await GenerateWithFallbackAsync(prompt, config, GeminiModels.V25Flash, GeminiModels.V25FlashLite, ct);
    }

    private async Task<string> GenerateWithFallbackAsync(string prompt, GenerateContentConfig config, string primaryModel, string fallbackModel, CancellationToken ct)
    {
        _logger.LogInformation("Starting Gemini generation. PrimaryModel={PrimaryModel}, FallbackModel={FallbackModel}, PromptLength={PromptLength}",
            primaryModel,
            fallbackModel,
            prompt.Length);
        string result = await TryGenerateTextAsync(primaryModel, prompt, config, false, ct);
        if (string.IsNullOrWhiteSpace(result))
        {
            _logger.LogWarning("Primary Gemini model returned empty response. Falling back to {FallbackModel}", fallbackModel);
            result = await TryGenerateTextAsync(fallbackModel, prompt, config, true, ct);
        }

        _logger.LogInformation("Gemini generation finished. ResultLength={ResultLength}", result.Length);
        return result;
    }

    private async Task<string> TryGenerateTextAsync(string model, string prompt, GenerateContentConfig config, bool isThrow, CancellationToken ct)
    {
        try
        {
            _logger.LogInformation("Calling Gemini API with {Model} model", model);
            GenerateContentResponse result = await _client.Models.GenerateContentAsync(model, prompt, config, ct);
            _logger.LogInformation("Gemini API completed successfully with model {Model}. ResponseLength={ResponseLength}", model, result.Text?.Length ?? 0);
            return result.Text ?? string.Empty;
        }
        catch (GoogleApiException ex) when (ex.HttpStatusCode == HttpStatusCode.Forbidden)
        {
            _logger.LogWarning(ex, "Gemini model {Model} returned 403 Forbidden", model);
            return isThrow ? throw new BusinessException(ErrorCode.AiGenerationFailed, "AI generation failed.", ex) : string.Empty;
        }
        catch (GoogleApiException ex)
        {
            _logger.LogError(ex, "Gemini API failed with model {Model}. StatusCode={StatusCode}", model, ex.HttpStatusCode);
            return isThrow ? throw new BusinessException(ErrorCode.AiGenerationFailed, "AI generation failed.", ex) : string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Gemini API failed unexpectedly with model {Model}", model);
            return isThrow ? throw new BusinessException(ErrorCode.AiGenerationFailed, "AI generation failed.", ex) : string.Empty;
        }
    }
}