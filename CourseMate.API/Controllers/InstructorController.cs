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

    [HttpGet("categories/{id:guid}")]
    public async Task<ActionResult> GetCategoryByIdAsync(Guid id)
    {
        return Ok();
    }

    [HttpPost("categories")]
    public async Task<ActionResult> CreateCategoryAsync()
    {
        return Ok();
    }

    [HttpPut("categories/{id:guid}")]
    public async Task<ActionResult> UpdateCategoryAsync(Guid id)
    {
        return Ok();
    }

    [HttpDelete("categories/{id:guid}")]
    public async Task<ActionResult> DeleteCategoryAsync(Guid id)
    {
        return Ok();
    }

    #endregion

    #region API Course

    [HttpGet("courses")]
    public async Task<ActionResult> GetListCourseAsync([FromQuery] GetListCategoriesQuery request)
    {
        return Ok();
    }

    [HttpGet("courses/{id:guid}")]
    public async Task<ActionResult> GetCourseByIdAsync(Guid id)
    {
        return Ok();
    }

    [HttpPost("courses")]
    public async Task<ActionResult> CreateCourseAsync()
    {
        return Ok();
    }

    [HttpPut("courses/{id:guid}")]
    public async Task<ActionResult> UpdateCourseAsync(Guid id)
    {
        return Ok();
    }

    [HttpDelete("courses/{id:guid}")]
    public async Task<ActionResult> DeleteCourseAsync(Guid id)
    {
        return Ok();
    }

    #endregion

    #region API Chapter

    [HttpGet("chapters")]
    public async Task<ActionResult> GetListChapterAsync([FromQuery] GetListCategoriesQuery request)
    {
        return Ok();
    }

    [HttpGet("chapters/{id:guid}")]
    public async Task<ActionResult> GetChapterByIdAsync(Guid id)
    {
        return Ok();
    }

    [HttpPost("chapters")]
    public async Task<ActionResult> CreateChapterAsync()
    {
        return Ok();
    }

    [HttpPut("chapters/{id:guid}")]
    public async Task<ActionResult> UpdateChapterAsync(Guid id)
    {
        return Ok();
    }

    [HttpDelete("chapters/{id:guid}")]
    public async Task<ActionResult> DeleteChapterAsync(Guid id)
    {
        return Ok();
    }

    #endregion

    #region API Lesson

    [HttpGet("lessons")]
    public async Task<ActionResult> GetListLessonAsync([FromQuery] GetListCategoriesQuery request)
    {
        return Ok();
    }

    [HttpGet("lessons/{id:guid}")]
    public async Task<ActionResult> GetLessonByIdAsync(Guid id)
    {
        return Ok();
    }

    [HttpPost("lessons")]
    public async Task<ActionResult> CreateLessonAsync()
    {
        return Ok();
    }

    [HttpPut("lessons/{id:guid}")]
    public async Task<ActionResult> UpdateLessonAsync(Guid id)
    {
        return Ok();
    }

    [HttpDelete("lessons/{id:guid}")]
    public async Task<ActionResult> DeleteLessonAsync(Guid id)
    {
        return Ok();
    }

    #endregion
}