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

    #region Video API

    [HttpPost("videos/upload/init")]
    public async Task<ActionResult> InitVideoAsync(InitVideoUploadCommand request)
    {
        InitVideoUploadResponse result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPost("videos/upload/chunks")]
    public async Task<ActionResult> UploadVideoChunkAsync(UploadVideoChunkCommand request)
    {
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpGet("videos/upload/status/{uploadId:guid}")]
    public async Task<ActionResult> GetVideoUploadStatusAsync(Guid uploadId)
    {
        VideoUploadStatusDto? result = await _mediator.Send(new GetVideoUploadStatusQuery
        {
            UploadId = uploadId
        });
        return Ok(result);
    }

    [HttpDelete("videos/upload/{uploadId:guid}")]
    public async Task<ActionResult> DeleteVideoUploadAsync(Guid uploadId)
    {
        await _mediator.Send(new DeleteVideoUploadCommand
        {
            UploadId = uploadId
        });
        return NoContent();
    }

    #endregion

    #region Image API

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