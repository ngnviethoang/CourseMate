using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Students;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/student")]
[Authorize(Roles = Roles.Student)]
public class StudentController : ControllerBase
{
    private readonly IMediator _mediator;

    public StudentController(IMediator mediator)
    {
        _mediator = mediator;
    }

    #region API Category

    [HttpGet("categories")]
    public async Task<ActionResult> GetListCategoriesAsync()
    {
        PagedDto<CategoryDto> result = await _mediator.Send(new GetListCategoriesQuery());
        return Ok(result);
    }

    #endregion

    #region API Cart

    [HttpGet("carts")]
    public async Task<ActionResult> GetCartAsync()
    {
        CartDto? result = await _mediator.Send(new GetCartQuery());
        return Ok(result);
    }

    [HttpPost("carts")]
    public async Task<ActionResult> CreateCartAsync([FromBody] CreateCartCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpDelete("carts/{id:guid}")]
    public async Task<ActionResult> DeleteCartAsync(Guid id)
    {
        await _mediator.Send(new DeleteCartCommand
        {
            CartItemId = id
        });

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
        CourseDetailDto? result = await _mediator.Send(new GetCourseByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpGet("courses/my")]
    public async Task<ActionResult> GetMyCoursesAsync([FromQuery] GetMyCoursesQuery request)
    {
        PagedDto<StudentMyCourseDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    #endregion

    #region API Order

    [HttpGet("orders")]
    public async Task<ActionResult> GetOrdersAsync([FromQuery] GetListOrdersQuery request)
    {
        PagedDto<OrderDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("orders/{id:guid}")]
    public async Task<ActionResult> GetOrderByIdAsync(Guid id)
    {
        OrderDto? result = await _mediator.Send(new GetOrderByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("orders")]
    public async Task<ActionResult> CreateOrdersAsync()
    {
        ResultIdDto result = await _mediator.Send(new CreateOrderCommand());
        return Ok(result);
    }

    [HttpPut("orders/{id:guid}")]
    public async Task<ActionResult> UpdateOrdersAsync(Guid id, [FromBody] UpdateOrderCommand request)
    {
        UpdateOrderCommand command = new()
        {
            Id = id,
            Status = request.Status
        };
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("orders/{id:guid}")]
    public async Task<ActionResult> DeleteOrderAsync(Guid id)
    {
        await _mediator.Send(new DeleteOrderCommand { Id = id });
        return NoContent();
    }

    #endregion

    #region API Lesson

    [HttpGet("lessons/{id:guid}")]
    public async Task<ActionResult> GetLessonByIdAsync(Guid id)
    {
        LessonDetailDto? result = await _mediator.Send(new GetLessonByIdQuery { Id = id });
        return Ok(result);
    }

    #endregion
}