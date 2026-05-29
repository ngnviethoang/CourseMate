using CourseMate.Application.Commands.Chapters;
using CourseMate.Application.Commands.Courses;
using CourseMate.Application.Commands.Lessons;
using CourseMate.Application.Queries.Courses;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class CourseController : ControllerBase
{
    private readonly IMediator _mediator;

    public CourseController(IMediator mediator)
    {
        _mediator = mediator;
    }

    #region Course APIs

    [HttpGet("courses")]
    [AllowAnonymous]
    public async Task<ActionResult> GetListCourseAsync([FromQuery] GetListCoursesQuery request)
    {
        PagedDto<CourseDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("courses/{id:guid}")]
    public async Task<ActionResult> GetCourseByIdAsync(Guid id)
    {
        CourseDetailDto? result = await _mediator.Send(new GetCourseByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("courses")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> CreateCourseAsync(CreateCourseCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("courses/{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpdateCourseAsync(Guid id, UpdateCourseCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("courses/{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> DeleteCourseAsync(Guid id)
    {
        await _mediator.Send(new DeleteCourseCommand { Id = id });
        return NoContent();
    }

    [HttpGet("courses/my")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Student}")]
    public async Task<ActionResult> GetMyCoursesAsync([FromQuery] GetMyCoursesQuery request)
    {
        PagedDto<StudentMyCourseDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("courses/recommended")]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> GetRecommendedCoursesAsync([FromQuery] GetRecommendedCoursesQuery request)
    {
        PagedDto<CourseDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    #endregion

    #region Chapter APIs

    [HttpGet("chapters")]
    public async Task<ActionResult> GetListChapterAsync([FromQuery] GetListChaptersQuery request)
    {
        PagedDto<ChapterDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("chapters/{id:guid}")]
    public async Task<ActionResult> GetChapterByIdAsync(Guid id)
    {
        ChapterDto? result = await _mediator.Send(new GetChapterByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("chapters")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> CreateChapterAsync(CreateChapterCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("chapters/{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpdateChapterAsync(Guid id, UpdateChapterCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("chapters/{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> DeleteChapterAsync(Guid id)
    {
        await _mediator.Send(new DeleteChapterCommand { Id = id });
        return NoContent();
    }

    #endregion

    #region Lesson APIs

    [HttpGet("lessons")]
    public async Task<ActionResult> GetListLessonAsync([FromQuery] GetListLessonsQuery request)
    {
        PagedDto<LessonDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("lessons/{id:guid}")]
    public async Task<ActionResult> GetLessonByIdAsync(Guid id)
    {
        LessonDto? result = await _mediator.Send(new GetLessonByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("lessons")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> CreateLessonAsync(CreateLessonCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("lessons/{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpdateLessonAsync(Guid id, UpdateLessonCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("lessons/{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> DeleteLessonAsync(Guid id)
    {
        await _mediator.Send(new DeleteLessonCommand { Id = id });
        return NoContent();
    }

    [HttpGet("lessons/{id:guid}/detail")]
    [Authorize]
    public async Task<ActionResult> GetLessonDetailAsync(Guid id)
    {
        LessonDetailDto? result = await _mediator.Send(new Application.Queries.Orders.GetLessonByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPut("lessons/{id:guid}/video")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpsertLessonVideoAsync(Guid id, CreateOrUpdateLessonVideoCommand request)
    {
        request.LessonId = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpPut("lessons/{id:guid}/reading")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpsertLessonReadingAsync(Guid id, CreateOrUpdateLessonReadingCommand request)
    {
        request.LessonId = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpPut("lessons/{id:guid}/coding")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpsertLessonCodingAsync(Guid id, CreateOrUpdateLessonCodingCommand request)
    {
        request.LessonId = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpPut("lessons/{id:guid}/quiz")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpsertLessonQuizAsync(Guid id, CreateOrUpdateLessonQuizCommand request)
    {
        request.LessonId = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpPut("lessons/{id:guid}/progress")]
    [Authorize]
    public async Task<ActionResult> UpdateLessonProgressAsync(Guid id, [FromBody] UpdateLessonProgressCommand request)
    {
        request.LessonId = id;
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    #endregion

    #region AI Process Document APIs

    /// <summary>
    ///     Upload a Word/PDF file for the lesson and trigger AI processing (parse + outline generation)
    /// </summary>
    [HttpPost("lessons/{lessonId:guid}/materials")]
    // [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
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
    [HttpGet("lessons/{lessonId:guid}/outline")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> GetOutlineAsync(Guid lessonId)
    {
        OutlineDto? result = await _mediator.Send(new GetOutlineQuery { LessonId = lessonId });
        return Ok(result);
    }

    /// <summary>
    ///     Update the lesson outline after user modifications
    /// </summary>
    [HttpPut("lessons/{lessonId:guid}/outline")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpdateOutlineAsync(Guid lessonId, [FromBody] UpdateOutlineCommand command)
    {
        command.LessonId = lessonId;
        OutlineDto result = await _mediator.Send(command);
        return Ok(result);
    }

    #endregion
}