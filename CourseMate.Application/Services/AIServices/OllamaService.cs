using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
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
    private readonly ILogger<OllamaService> _logger;
    private readonly OllamaApiClient _ollamaApiClient;

    public OllamaService(
        IOptions<OllamaOptions> options,
        ILogger<OllamaService> logger)
    {
        _logger = logger;
        _ollamaApiClient = new OllamaApiClient(options.Value.Url);
    }

    public async Task<ReadOnlyMemory<float>> GenerateVectorAsync(string input, CancellationToken ct)
    {
        try
        {
            _logger.LogInformation("Calling Ollama API");
            EmbedResponse response = await _ollamaApiClient.EmbedAsync(new EmbedRequest
            {
                Model = OllamaModels.NomicEmbedText,
                Input = [input],
                Dimensions = 768
            }, ct);

            float[]? vector = response.Embeddings.FirstOrDefault();
            _logger.LogInformation("Ollama API completed");
            return new ReadOnlyMemory<float>(vector);
        }
        catch (OllamaException ex)
        {
            _logger.LogError(ex, "Ollama embedding failed");
            throw new BusinessException(ErrorCode.EmbeddingFailed, "AI embedding failed.", ex);
        }
    }

    public async Task<string> SearchAsync(string input, CancellationToken ct)
    {
        string prompt = PromptBuilder.BuildResearchPrompt(input);
        try
        {
            IChatClient chatClient = _ollamaApiClient;
            _logger.LogInformation(
                "Starting Ollama search generation. InputLength={InputLength}, PromptLength={PromptLength}, Model={ModelId}",
                input.Length,
                prompt.Length,
                OllamaModels.Llama3);
            ChatResponse response = await chatClient.GetResponseAsync(prompt, new ChatOptions
            {
                ModelId = OllamaModels.Llama3,
                Temperature = 0.0f,
                MaxOutputTokens = 1024
            }, ct);
            _logger.LogInformation(
                "Ollama search generation completed. Model={ModelId}, ResponseLength={ResponseLength}",
                OllamaModels.Llama3,
                response.Text?.Length ?? 0);
            return response.Text ?? string.Empty;
        }
        catch (OllamaException ex)
        {
            _logger.LogError(ex, "Ollama search generation failed. Model={ModelId}", OllamaModels.Llama3);
            throw new BusinessException(ErrorCode.AiGenerationFailed, "AI generation failed.", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ollama search generation failed unexpectedly. Model={ModelId}", OllamaModels.Llama3);
            throw new BusinessException(ErrorCode.AiGenerationFailed, "AI generation failed.", ex);
        }
    }

    public async Task<string> GenerateContentAsync(string input, LessonMaterialPromptType promptType, CancellationToken ct)
    {
        string prompt = promptType == LessonMaterialPromptType.Reading
            ? PromptBuilder.BuildReadingLessonOutlinePrompt(input)
            : PromptBuilder.BuildLectureOutlinePrompt(input);

        try
        {
            IChatClient chatClient = _ollamaApiClient;
            _logger.LogInformation(
                "Starting Ollama content generation. PromptType={PromptType}, InputLength={InputLength}, PromptLength={PromptLength}, Model={ModelId}",
                promptType,
                input.Length,
                prompt.Length,
                OllamaModels.Llama3);
            ChatResponse response = await chatClient.GetResponseAsync(prompt, new ChatOptions
            {
                ModelId = OllamaModels.Llama3,
                Temperature = 0.2f,
                MaxOutputTokens = 4096
            }, ct);
            _logger.LogInformation(
                "Ollama content generation completed. PromptType={PromptType}, Model={ModelId}, ResponseLength={ResponseLength}",
                promptType,
                OllamaModels.Llama3,
                response.Text?.Length ?? 0);
            return response.Text ?? string.Empty;
        }

        catch (OllamaException ex)
        {
            _logger.LogError(ex, "Ollama content generation failed. PromptType={PromptType}, Model={ModelId}", promptType, OllamaModels.Llama3);
            throw new BusinessException(ErrorCode.AiGenerationFailed, "AI generation failed.", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ollama content generation failed unexpectedly. PromptType={PromptType}, Model={ModelId}", promptType, OllamaModels.Llama3);
            throw new BusinessException(ErrorCode.AiGenerationFailed, "AI generation failed.", ex);
        }
    }
}