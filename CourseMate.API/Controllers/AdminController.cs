using CourseMate.Application.Commands.Admins;
using CourseMate.Application.Queries.Admins;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
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

    [HttpGet("dashboard")]
    public async Task<ActionResult> GetDashboardDataAsync()
    {
        DashboardDto result = await _mediator.Send(new GetDashboardDataQuery());
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
        CategoryDto? result = await _mediator.Send(new GetCategoryByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("categories")]
    public async Task<ActionResult> CreateCategoryAsync(CreateCategoryCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("categories/{id:guid}")]
    public async Task<ActionResult> UpdateCategoryAsync(Guid id, UpdateCategoryCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("categories/{id:guid}")]
    public async Task<ActionResult> DeleteCategoryAsync(Guid id)
    {
        await _mediator.Send(new DeleteCategoryCommand { Id = id });
        return NoContent();
    }

    #endregion

    #region API Course

    [HttpGet("courses")]
    public async Task<ActionResult> GetListCourseAsync([FromQuery] GetListCoursesQuery request)
    {
        PagedDto<CourseDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("courses/{id:guid}")]
    public async Task<ActionResult> GetCourseByIdAsync(Guid id)
    {
        CourseDto? result = await _mediator.Send(new GetCourseByIdQuery { Id = id });
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

    #region API User

    [HttpGet("users")]
    public async Task<ActionResult> GetListUserAsync([FromQuery] GetListUsersQuery request)
    {
        PagedDto<UserDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("users/{id:guid}")]
    public async Task<ActionResult> GetUserByIdAsync(Guid id)
    {
        UserDto? result = await _mediator.Send(new GetUserByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("users")]
    public async Task<ActionResult> CreateUserAsync(CreateUserCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("users/{id:guid}")]
    public async Task<ActionResult> UpdateUserAsync(Guid id, UpdateUserCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("users/{id:guid}")]
    public async Task<ActionResult> DeleteUserAsync(Guid id)
    {
        await _mediator.Send(new DeleteUserCommand { Id = id });
        return NoContent();
    }

    #endregion

    #region API Order

    [HttpGet("orders")]
    public async Task<ActionResult> GetListOrderAsync([FromQuery] GetListOrdersQuery request)
    {
        PagedDto<AdminOrderDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("orders/{id:guid}")]
    public async Task<ActionResult> GetOrderByIdAsync(Guid id)
    {
        AdminOrderDto? result = await _mediator.Send(new GetOrderByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPut("orders/{id:guid}")]
    public async Task<ActionResult> UpdateOrderAsync(Guid id, UpdateOrderCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    #endregion
}