using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Admins;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = Roles.Admin)]
public class AdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
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
        CategoryDto? result = await _mediator.Send(new GetCategoryByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategoryAsync(CreateCategoryCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("categories/{id:guid}")]
    public async Task<IActionResult> UpdateCategoryAsync(Guid id, UpdateCategoryCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("categories/{id:guid}")]
    public async Task<IActionResult> DeleteCategoryAsync(Guid id)
    {
        await _mediator.Send(new DeleteCategoryCommand { Id = id });
        return NoContent();
    }

    #endregion

    #region API Course

    [HttpGet("courses")]
    public async Task<IActionResult> GetListCourseAsync([FromQuery] GetListCoursesQuery request)
    {
        PagedDto<CourseDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("courses/{id:guid}")]
    public async Task<IActionResult> GetCourseByIdAsync(Guid id)
    {
        CourseDto? result = await _mediator.Send(new GetCourseByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("courses")]
    public async Task<IActionResult> CreateCourseAsync(CreateCourseCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("courses/{id:guid}")]
    public async Task<IActionResult> UpdateCourseAsync(Guid id, UpdateCourseCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("courses/{id:guid}")]
    public async Task<IActionResult> DeleteCourseAsync(Guid id)
    {
        await _mediator.Send(new DeleteCourseCommand { Id = id });
        return NoContent();
    }

    #endregion

    #region API Chapter

    [HttpGet("chapters")]
    public async Task<IActionResult> GetListChapterAsync([FromQuery] GetListChaptersQuery request)
    {
        PagedDto<ChapterDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("chapters/{id:guid}")]
    public async Task<IActionResult> GetChapterByIdAsync(Guid id)
    {
        ChapterDto? result = await _mediator.Send(new GetChapterByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("chapters")]
    public async Task<IActionResult> CreateChapterAsync(CreateChapterCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("chapters/{id:guid}")]
    public async Task<IActionResult> UpdateChapterAsync(Guid id, UpdateChapterCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("chapters/{id:guid}")]
    public async Task<IActionResult> DeleteChapterAsync(Guid id)
    {
        await _mediator.Send(new DeleteChapterCommand { Id = id });
        return NoContent();
    }

    #endregion

    #region API Lesson

    [HttpGet("lessons")]
    public async Task<IActionResult> GetListLessonAsync([FromQuery] GetListLessonsQuery request)
    {
        PagedDto<LessonDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("lessons/{id:guid}")]
    public async Task<IActionResult> GetLessonByIdAsync(Guid id)
    {
        LessonDto? result = await _mediator.Send(new GetLessonByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("lessons")]
    public async Task<IActionResult> CreateLessonAsync(CreateLessonCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("lessons/{id:guid}")]
    public async Task<IActionResult> UpdateLessonAsync(Guid id, UpdateLessonCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("lessons/{id:guid}")]
    public async Task<IActionResult> DeleteLessonAsync(Guid id)
    {
        await _mediator.Send(new DeleteLessonCommand { Id = id });
        return NoContent();
    }

    #endregion

    #region API User

    [HttpGet("users")]
    public async Task<IActionResult> GetListUserAsync([FromQuery] GetListUsersQuery request)
    {
        PagedDto<UserDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("users/{id:guid}")]
    public async Task<IActionResult> GetUserByIdAsync(Guid id)
    {
        UserDto? result = await _mediator.Send(new GetUserByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("users")]
    public async Task<IActionResult> CreateUserAsync(CreateUserCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("users/{id:guid}")]
    public async Task<IActionResult> UpdateUserAsync(Guid id, UpdateUserCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("users/{id:guid}")]
    public async Task<IActionResult> DeleteUserAsync(Guid id)
    {
        await _mediator.Send(new DeleteUserCommand { Id = id });
        return NoContent();
    }

    #endregion
}