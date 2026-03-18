using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Admins;
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

    #region API Category

    [HttpGet("categories")]
    public async Task<IActionResult> GetListCategoriesAsync([FromQuery] GetListCategoriesQuery request)
    {
        PagedDto<CategoryDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("categories/{id:guid}")]
    public async Task<IActionResult> GetCategoryByIdAsync(Guid id)
    {
        return Ok();
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategoryAsync()
    {
        return Ok();
    }

    [HttpPut("categories/{id:guid}")]
    public async Task<IActionResult> UpdateCategoryAsync(Guid id)
    {
        return Ok();
    }

    [HttpDelete("categories/{id:guid}")]
    public async Task<IActionResult> DeleteCategoryAsync(Guid id)
    {
        return Ok();
    }

    #endregion

    #region API Course

    [HttpGet("courses")]
    public async Task<IActionResult> GetListCourseAsync([FromQuery] GetListCategoriesQuery request)
    {
        return Ok();
    }

    [HttpGet("courses/{id:guid}")]
    public async Task<IActionResult> GetCourseByIdAsync(Guid id)
    {
        return Ok();
    }

    [HttpPost("courses")]
    public async Task<IActionResult> CreateCourseAsync()
    {
        return Ok();
    }

    [HttpPut("courses/{id:guid}")]
    public async Task<IActionResult> UpdateCourseAsync(Guid id)
    {
        return Ok();
    }

    [HttpDelete("courses/{id:guid}")]
    public async Task<IActionResult> DeleteCourseAsync(Guid id)
    {
        return Ok();
    }

    #endregion

    #region API Chapter

    [HttpGet("chapters")]
    public async Task<IActionResult> GetListChapterAsync([FromQuery] GetListCategoriesQuery request)
    {
        return Ok();
    }

    [HttpGet("chapters/{id:guid}")]
    public async Task<IActionResult> GetChapterByIdAsync(Guid id)
    {
        return Ok();
    }

    [HttpPost("chapters")]
    public async Task<IActionResult> CreateChapterAsync()
    {
        return Ok();
    }

    [HttpPut("chapters/{id:guid}")]
    public async Task<IActionResult> UpdateChapterAsync(Guid id)
    {
        return Ok();
    }

    [HttpDelete("chapters/{id:guid}")]
    public async Task<IActionResult> DeleteChapterAsync(Guid id)
    {
        return Ok();
    }

    #endregion

    #region API Lesson

    [HttpGet("lessons")]
    public async Task<IActionResult> GetListLessonAsync([FromQuery] GetListCategoriesQuery request)
    {
        return Ok();
    }

    [HttpGet("lessons/{id:guid}")]
    public async Task<IActionResult> GetLessonByIdAsync(Guid id)
    {
        return Ok();
    }

    [HttpPost("lessons")]
    public async Task<IActionResult> CreateLessonAsync()
    {
        return Ok();
    }

    [HttpPut("lessons/{id:guid}")]
    public async Task<IActionResult> UpdateLessonAsync(Guid id)
    {
        return Ok();
    }

    [HttpDelete("lessons/{id:guid}")]
    public async Task<IActionResult> DeleteLessonAsync(Guid id)
    {
        return Ok();
    }

    #endregion
}