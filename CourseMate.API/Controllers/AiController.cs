using CourseMate.Application.Commands.Courses;
using CourseMate.Contracts.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/ai")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly IMediator _mediator;

    public AiController(IMediator mediator)
    {
        _mediator = mediator;
    }

    #region API AI Process Document

    /// <summary>
    ///     Upload a Word/PDF file for the lesson and trigger AI processing (parse + outline generation)
    /// </summary>
    [HttpPost("{lessonId:guid}/materials")]
    public async Task<ActionResult> CreateLessonMaterialAsync(Guid lessonId, IFormFile request)
    {
        if (request.Length == 0)
        {
            return BadRequest();
        }

        using MemoryStream stream = new();
        await request.CopyToAsync(stream);
        ProcessingStatusDto result = await _mediator.Send(new CreateLessonMaterialCommand
        {
            LessonId = lessonId,
            FileName = request.FileName,
            Content = stream.ToArray()
        });

        return Ok(result);
    }

    /// <summary>
    ///     Retrieve the AI-generated outline for the lesson
    /// </summary>
    [HttpGet("{lessonId:guid}/outline")]
    public async Task<ActionResult> GetOutlineAsync(Guid lessonId)
    {
        OutlineDto? result = await _mediator.Send(new GetOutlineQuery { LessonId = lessonId });
        return Ok(result);
    }

    /// <summary>
    ///     Update the lesson outline after user modifications
    /// </summary>
    [HttpPut("{lessonId:guid}/outline")]
    public async Task<ActionResult> UpdateOutlineAsync(Guid lessonId, [FromBody] UpdateOutlineCommand command)
    {
        command.LessonId = lessonId;
        OutlineDto result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    ///     Regenerate the lesson outline using AI
    /// </summary>
    [HttpPost("{lessonId:guid}/outline/regenerate")]
    public async Task<ActionResult> RegenerateOutlineAsync(Guid lessonId)
    {
        ProcessingStatusDto result = await _mediator.Send(new RegenerateOutlineCommand { LessonId = lessonId });
        return Ok(result);
    }

    /// <summary>
    ///     Generate slide content from the approved lesson outline.
    /// </summary>
    [HttpPost("{lessonId:guid}/generate-slide")]
    public async Task<ActionResult> GenerateSlideAsync(Guid lessonId)
    {
        ProcessingStatusDto result = await _mediator.Send(new GenerateSlideCommand { LessonId = lessonId });
        return Ok(result);
    }

    /// <summary>
    ///     Download the generated slide file.
    /// </summary>
    [HttpGet("{lessonId:guid}/slide")]
    public async Task<ActionResult> DownloadSlideAsync(Guid lessonId)
    {
        return Ok();
    }

    /// <summary>
    ///     Get the current processing status of the lesson.
    /// </summary>
    [HttpGet("{lessonId:guid}/status")]
    public async Task<ActionResult> GetStatusAsync(Guid lessonId)
    {
        ProcessingStatusDto result = await _mediator.Send(new GetProcessingStatusQuery { LessonId = lessonId });
        return Ok(result);
    }

    #endregion
}