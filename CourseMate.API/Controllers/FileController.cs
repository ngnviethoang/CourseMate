using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts.DTOs.Files;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/files")]
[Authorize]
public class FileController : ControllerBase
{
    private readonly IMediator _mediator;

    public FileController(IMediator mediator)
    {
        _mediator = mediator;
    }

    #region API Video

    /// <summary>
    /// FileName is .mp4
    /// FileSize is in MB
    /// </summary>
    [HttpPost("videos/init")]
    public async Task<ActionResult> InitUploadVideoAsync(InitVideoUploadCommand request)
    {
        InitVideoUploadResponse result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPost("videos/{fileId:Guid}/chunks/{chunkIndex:int}")]
    public async Task<ActionResult> UploadVideoChunkAsync([FromRoute] Guid fileId, [FromRoute] [Range(1, 100)] int chunkIndex, IFormFile file)
    {
        using MemoryStream stream = new();
        await file.CopyToAsync(stream);
        await _mediator.Send(new UploadVideoChunkCommand
        {
            FileId = fileId,
            ChunkIndex = chunkIndex,
            Content = stream.ToArray()
        });
        return NoContent();
    }

    [HttpPost("videos/completed")]
    public async Task<ActionResult> UploadVideoCompletedAsync(CompletedVideoUploadCommand request)
    {
        CompleteVideoUploadResponse result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("videos/{fileId:guid}")]
    public async Task<ActionResult> GetVideoUploadStatusAsync(Guid fileId)
    {
        VideoUploadStatusDto? result = await _mediator.Send(new GetVideoUploadStatusQuery
        {
            FileId = fileId
        });
        return Ok(result);
    }

    [HttpDelete("videos/{fileId:guid}")]
    public async Task<ActionResult> DeleteVideoIdAsync(Guid fileId)
    {
        await _mediator.Send(new DeleteVideoByIdCommand
        {
            FileId = fileId
        });
        return NoContent();
    }

    #endregion

    #region API Image

    [HttpPost("images")]
    public async Task<ActionResult> UploadImageAsync(IFormFile request)
    {
        if (request.Length == 0)
        {
            return BadRequest();
        }

        using MemoryStream stream = new();
        await request.CopyToAsync(stream);
        UploadImageResponse result = await _mediator.Send(new UploadImageCommand
        {
            FileName = request.FileName,
            ContentType = request.ContentType,
            Content = stream.ToArray()
        });

        return Ok(result);
    }

    [HttpDelete("images/{fileId:Guid}")]
    public async Task<ActionResult> DeleteImageAsync(Guid fileId)
    {
        await _mediator.Send(new DeleteImageCommand
        {
            FileId = fileId
        });

        return NoContent();
    }

    [HttpGet("images/{fileId:Guid}")]
    public async Task<IActionResult> GetImageAsync(Guid fileId)
    {
        ImageFileResponse? result = await _mediator.Send(new GetImageFileQuery
        {
            FileId = fileId
        });

        if (result == null)
        {
            return NotFound();
        }

        return File(result.Content, result.ContentType, result.FileName);
    }

    #endregion
}