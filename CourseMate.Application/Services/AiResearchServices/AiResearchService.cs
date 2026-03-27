using System.Text.Json;
using CourseMate.Contracts.DTOs.Instructors;
using CourseMate.Contracts.Options;
using GenerativeAI;
using GenerativeAI.Types;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Services.AiResearchServices;

public class AiResearchService : IAiResearchService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    private readonly ILogger<AiResearchService> _logger;
    private readonly GenerativeModel _model;

    public AiResearchService(IOptions<AiOptions> aiOptions, ILogger<AiResearchService> logger)
    {
        _logger = logger;
        AiOptions options = aiOptions.Value;

        GoogleAi genAi = new(options.ApiKey);
        _model = genAi.CreateGenerativeModel(options.Model);
    }

    public async Task<List<OutlineSectionDto>> GenerateOutlineAsync(string parsedContentJson, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Generating outline via Gemini AI");
        string prompt = $$"""
                          You are an expert educational content designer. Given the following parsed lecture content (in JSON format),
                          create a well-structured slide outline for a presentation.
                          Requirements:
                          - Create logical sections with clear titles
                          - Each section should have 3-6 concise bullet points
                          - Add speaker notes for each section
                          - Suggest relevant images for each section (describe what image would be appropriate)
                          - Order sections logically for a lecture flow
                          - Use professional, educational language
                          Parsed content:
                          {{parsedContentJson}}
                          Respond ONLY with a valid JSON array in this exact format (no markdown, no code blocks):
                          [
                            {
                                "order": 1,
                              "title": "Section Title",
                              "bullets": ["bullet 1", "bullet 2", "bullet 3"],
                                 "speakerNotes": "Notes for the presenter",
                             "imageSuggestion": "Description of suggested image"
                             }
                          ]
                          """;

        string responseText = await CallGeminiAsync(prompt, cancellationToken);
        return DeserializeOutline(responseText);
    }

    public async Task<List<OutlineSectionDto>> GenerateSlideContentAsync(string outlineJson, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Generating detailed slide content via Gemini AI");

        string prompt = $$"""
                              You are an expert presentation designer...
                              Current outline:
                              {{outlineJson}}
                              Respond ONLY with a valid JSON array:
                              [
                                {
                                  "order": 1,
                                  "title": "Enhanced Section Title",
                                  "bullets": ["concise bullet 1", "concise bullet 2"],
                                  "speakerNotes": "Detailed notes...",
                                  "imageSuggestion": "Description..."
                                }
                              ]
                          """;

        string responseText = await CallGeminiAsync(prompt, cancellationToken);
        return DeserializeOutline(responseText);
    }

    private async Task<string> CallGeminiAsync(string prompt, CancellationToken cancellationToken)
    {
        try
        {
            GenerateContentResponse response = await _model.GenerateContentAsync(prompt, cancellationToken);
            string text = response.Text ?? string.Empty;

            // Strip markdown code blocks if present
            text = text.Trim();
            if (text.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
            {
                text = text["```json".Length..];
            }
            else if (text.StartsWith("```"))
            {
                text = text[3..];
            }

            if (text.EndsWith("```"))
            {
                text = text[..^3];
            }

            return text.Trim();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to call Gemini AI");
            throw;
        }
    }

    private List<OutlineSectionDto> DeserializeOutline(string json)
    {
        try
        {
            List<OutlineSectionDto>? sections = JsonSerializer.Deserialize<List<OutlineSectionDto>>(json, JsonOptions);
            return sections ?? [];
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize AI response: {Response}", json[..Math.Min(500, json.Length)]);
            throw new InvalidOperationException("AI returned invalid JSON format. Please try again.", ex);
        }
    }
}