using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.DTOs.Instructors;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/instructor")]
[Authorize(Roles = Roles.Instructor)]
public class InstructorController : ControllerBase
{
    private readonly IMediator _mediator;

    public InstructorController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult> GetDashboardDataAsync()
    {
        DashboardDto result = await _mediator.Send(new GetInstructorDashboardDataQuery());
        return Ok(result);
    }

    #region API Category

    [HttpGet("categories")]
    public async Task<ActionResult> GetListCategoriesAsync([FromQuery] GetListCategoriesQuery request)
    {
        PagedDto<CategoryDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    #endregion

    #region API Course

    [HttpGet("courses")]
    public async Task<ActionResult> GetListCourseAsync([FromQuery] GetInstructorCoursesQuery request)
    {
        PagedDto<CourseDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("courses/{id:guid}")]
    public async Task<ActionResult> GetCourseByIdAsync(Guid id)
    {
        CourseDto? result = await _mediator.Send(new GetInstructorCourseByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("courses")]
    public async Task<ActionResult> CreateCourseAsync(CreateCourseCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("courses/{id:guid}")]
    public async Task<ActionResult> UpdateCourseAsync(Guid id, UpdateCourseCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("courses/{id:guid}")]
    public async Task<ActionResult> DeleteCourseAsync(Guid id)
    {
        await _mediator.Send(new DeleteCourseCommand { Id = id });
        return NoContent();
    }

    #endregion

    #region API Chapter

    [HttpGet("chapters")]
    public async Task<ActionResult> GetListChapterAsync([FromQuery] GetInstructorChaptersQuery request)
    {
        PagedDto<ChapterDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("chapters/{id:guid}")]
    public async Task<ActionResult> GetChapterByIdAsync(Guid id)
    {
        ChapterDto? result = await _mediator.Send(new GetInstructorChapterByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("chapters")]
    public async Task<ActionResult> CreateChapterAsync(CreateChapterCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("chapters/{id:guid}")]
    public async Task<ActionResult> UpdateChapterAsync(Guid id, UpdateChapterCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("chapters/{id:guid}")]
    public async Task<ActionResult> DeleteChapterAsync(Guid id)
    {
        await _mediator.Send(new DeleteChapterCommand { Id = id });
        return NoContent();
    }

    #endregion

    #region API Lesson

    [HttpGet("lessons")]
    public async Task<ActionResult> GetListLessonAsync([FromQuery] GetInstructorLessonsQuery request)
    {
        PagedDto<LessonDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("lessons/{id:guid}")]
    public async Task<ActionResult> GetLessonByIdAsync(Guid id)
    {
        LessonDto? result = await _mediator.Send(new GetInstructorLessonByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("lessons")]
    public async Task<ActionResult> CreateLessonAsync(CreateLessonCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("lessons/{id:guid}")]
    public async Task<ActionResult> UpdateLessonAsync(Guid id, UpdateLessonCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("lessons/{id:guid}")]
    public async Task<ActionResult> DeleteLessonAsync(Guid id)
    {
        await _mediator.Send(new DeleteLessonCommand { Id = id });
        return NoContent();
    }

    #endregion

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