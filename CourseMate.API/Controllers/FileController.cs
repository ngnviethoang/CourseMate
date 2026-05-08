using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Commands.Files;
using CourseMate.Application.Queries.Files;
using CourseMate.Contracts.DTOs;
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

    [HttpDelete("{fileId:Guid}")]
    public async Task<ActionResult> DeleteFileAsync(Guid fileId)
    {
        await _mediator.Send(new DeleteFileCommand
        {
            FileId = fileId
        });

        return NoContent();
    }

    #region API Video

    [HttpPost("videos/init")]
    public async Task<ActionResult> InitUploadVideoAsync()
    {
        InitVideoUploadResponse result = await _mediator.Send(new InitVideoUploadCommand());
        return Ok(result);
    }

    /// <summary>
    ///     Only accept is .mp4 file
    /// </summary>
    [HttpPost("videos/{fileId:Guid}/chunks/{chunkIndex:int}")]
    public async Task<ActionResult> UploadVideoChunkAsync([FromRoute] Guid fileId, [FromRoute] [Range(1, 100)] int chunkIndex, IFormFile file)
    {
        using MemoryStream stream = new();
        await file.CopyToAsync(stream);
        await _mediator.Send(new UploadVideoChunkCommand
        {
            FileId = fileId,
            FileName = file.FileName,
            ChunkIndex = chunkIndex,
            Content = stream.ToArray()
        });
        return NoContent();
    }

    [HttpPost("videos/completed")]
    public async Task<ActionResult> UploadVideoCompletedAsync(CompletedVideoUploadCommand request)
    {
        FileUploadResponse result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("videos/{fileId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult> GetVideoUploadStatusAsync(Guid fileId)
    {
        VideoUploadStatusDto? result = await _mediator.Send(new GetVideoUploadStatusQuery
        {
            FileId = fileId
        });
        return Ok(result);
    }

    [AllowAnonymous]
    [Obsolete("Disabled in Swagger UI.")]
    [HttpGet("videos/stream/{fileId:guid}")]
    public async Task<ActionResult> StreamVideoAsync(Guid fileId)
    {
        VideoFilePathDto? result = await _mediator.Send(new GetVideoFilePathQuery
        {
            FileId = fileId
        });

        if (result == null || !System.IO.File.Exists(result.FilePath))
        {
            return NotFound();
        }

        FileStream stream = new(result.FilePath, FileMode.Open, FileAccess.Read);
        return File(stream, "video/mp4", true);
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
        FileUploadResponse result = await _mediator.Send(new UploadImageCommand
        {
            FileName = request.FileName,
            ContentType = request.ContentType,
            Content = stream.ToArray()
        });

        return Ok(result);
    }

    [AllowAnonymous]
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

    #region API Document

    [HttpPost("documents")]
    public async Task<ActionResult> UploadDocumentAsync(IFormFile request)
    {
        if (request.Length == 0)
        {
            return BadRequest();
        }

        using MemoryStream stream = new();
        await request.CopyToAsync(stream);
        FileUploadResponse result = await _mediator.Send(new UploadDocumentCommand
        {
            FileName = request.FileName,
            ContentType = request.ContentType,
            Content = stream.ToArray()
        });

        return Ok(result);
    }

    [AllowAnonymous]
    [HttpGet("documents/{fileId:Guid}")]
    public async Task<IActionResult> GetDocumentAsync(Guid fileId)
    {
        DocumentFileResponse? result = await _mediator.Send(new GetDocumentFileQuery
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