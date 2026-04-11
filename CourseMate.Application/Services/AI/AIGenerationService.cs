using System.Text;
using System.Text.Json;
using CourseMate.Contracts.DTOs;
using DocumentFormat.OpenXml.Packaging;
using Microsoft.Extensions.Logging;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;

namespace CourseMate.Application.Services.AI;

public class AIGenerationService : IAIGenerationService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AIGenerationService> _logger;

    public AIGenerationService(HttpClient httpClient, ILogger<AIGenerationService> logger)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("http://host.docker.internal:11434"); // Default Ollama port
        _logger = logger;
    }

    public async Task<GeneratedLessonDto> GenerateLessonFromTextAsync(string rawContent, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Generating lesson from raw text.");

        // Use Prompt Engineering to force JSON output
        string systemPrompt = @"Bạn là một Chuyên gia soạn thảo bài giảng điện tử. 
Nhiệm vụ của bạn là chuyển đổi tài liệu thô thành một bài học hoàn chỉnh.
RÀNG BUỘC:
1. Chỉ tạo nội dung cho 01 bài học duy nhất.
2. Ngữ Tiếng Việt chuyên nghiệp.
3. Mỗi Slide gồm tiêu đề và tối đa 5 gạch đầu dòng.
4. ĐỊNH DẠNG: TRẢ VỀ DUY NHẤT JSON THEO CẤU TRÚC ĐƯỢC CHỈ ĐỊNH. Không giải thích thêm.
Cấu trúc yêu cầu:
{
  ""lesson_info"": {
    ""title"": ""Tên bài học"",
    ""summary"": ""Tóm tắt ngắn gọn"",
    ""learning_outcomes"": [""Mục tiêu 1""]
  },
  ""slides"": [
    {
      ""slide_number"": 1,
      ""title"": ""Tiêu đề"",
      ""type"": ""content_slide"",
      ""bullet_points"": [""Ý 1""],
      ""explanation_for_teacher"": ""Lời giải thích"",
      ""visual_idea"": ""Gợi ý hình ảnh""
    }
  ]
}";
        string userPrompt = $"Đây là tài liệu thô:\n{rawContent}";

        var payload = new
        {
            model = "llama3", // or qwen2.5-coder
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userPrompt }
            },
            stream = false,
            options = new { temperature = 0.5 } // Lower temp for more deterministic JSON
        };

        StringContent content = new(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        try
        {
            // Call Ollama local /api/chat endpoint
            HttpResponseMessage response = await _httpClient.PostAsync("/api/chat", content, cancellationToken);
            response.EnsureSuccessStatusCode();

            string responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
            using JsonDocument doc = JsonDocument.Parse(responseBody);
            string? aiMessage = doc.RootElement.GetProperty("message").GetProperty("content").GetString();

            // Clean markdown block if LLM added ```json ... ```
            string? cleanJson = aiMessage?.Trim();
            if (cleanJson != null && cleanJson.StartsWith("```json"))
            {
                cleanJson = cleanJson.Substring(7);
                if (cleanJson.EndsWith("```"))
                {
                    cleanJson = cleanJson.Substring(0, cleanJson.Length - 3);
                }
            }

            cleanJson = cleanJson?.Trim();

            JsonSerializerOptions options = new()
                { PropertyNameCaseInsensitive = true };
            GeneratedLessonDto? result = JsonSerializer.Deserialize<GeneratedLessonDto>(cleanJson ?? "{}", options);

            return result ?? new GeneratedLessonDto();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while calling Ollama API for lesson generation.");
            throw new Exception("AI Generation Failed: " + ex.Message);
        }
    }

    public async Task<GeneratedLessonDto> GenerateLessonFromFileAsync(Stream fileStream, string fileName, string? additionalRawContent, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Extracting text from uploaded file: {FileName}", fileName);
        StringBuilder extractedText = new();

        try
        {
            string extension = Path.GetExtension(fileName).ToLowerInvariant();

            if (extension == ".pdf")
            {
                using PdfDocument document = PdfDocument.Open(fileStream);
                foreach (Page page in document.GetPages())
                {
                    extractedText.AppendLine(page.Text);
                }
            }
            else if (extension == ".docx")
            {
                using WordprocessingDocument doc = WordprocessingDocument.Open(fileStream, false);
                extractedText.AppendLine(doc.MainDocumentPart?.Document.Body?.InnerText ?? string.Empty);
            }
            else if (extension == ".txt" || extension == ".md")
            {
                using StreamReader reader = new(fileStream);
                extractedText.AppendLine(await reader.ReadToEndAsync(cancellationToken));
            }
            else
            {
                throw new Exception("Unsupported file format. Please upload .pdf, .docx, or .txt files.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to extract text from file");
            throw new Exception("Failed to read the file content: " + ex.Message);
        }

        string fullContent = extractedText.ToString();
        if (!string.IsNullOrWhiteSpace(additionalRawContent))
        {
            fullContent = $"[GHI CHÚ BỔ SUNG]:\n{additionalRawContent}\n\n[NỘI DUNG TÀI LIỆU]:\n{fullContent}";
        }

        return await GenerateLessonFromTextAsync(fullContent, cancellationToken);
    }
}