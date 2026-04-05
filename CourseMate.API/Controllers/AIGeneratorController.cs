using System.Threading;
using System.Threading.Tasks;
using CourseMate.Application.Services.AI;
using CourseMate.Contracts.DTOs.AIGeneration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace CourseMate.API.Controllers;

[Route("api/ai/generate-lesson")]
[ApiController]
public class AIGeneratorController : ControllerBase
{
    private readonly IAIGenerationService _aiGenerationService;

    public AIGeneratorController(IAIGenerationService aiGenerationService)
    {
        _aiGenerationService = aiGenerationService;
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> GenerateLesson([FromForm] GenerateLessonFormRequest request, CancellationToken cancellationToken)
    {
        if (request.File == null && string.IsNullOrWhiteSpace(request.RawContent))
        {
            return BadRequest(new { Message = "You must provide either a file or raw content." });
        }

        GeneratedLessonDto result;

        if (request.File != null)
        {
            using var stream = request.File.OpenReadStream();
            result = await _aiGenerationService.GenerateLessonFromFileAsync(stream, request.File.FileName, request.RawContent, cancellationToken);
        }
        else
        {
            result = await _aiGenerationService.GenerateLessonFromTextAsync(request.RawContent!, cancellationToken);
        }

        return Ok(result);
    }
}

public class GenerateLessonFormRequest
{
    public IFormFile? File { get; set; }
    public string? RawContent { get; set; }
}
