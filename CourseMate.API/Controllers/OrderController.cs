using CourseMate.Application.Commands.Orders;
using CourseMate.Application.Queries.Orders;
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
public class OrderController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrderController(IMediator mediator)
    {
        _mediator = mediator;
    }

    #region API Enrollment

    [HttpPost("enrollments/free")]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> EnrollFreeAsync(CreateEnrollmentFreeCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    #endregion

    #region API Cart

    [HttpGet("carts")]
    [Authorize(Roles = Roles.Admin)]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> GetCartAsync([FromQuery] GetCartQuery request)
    {
        CartDto? result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPost("carts")]
    [Authorize(Roles = Roles.Admin)]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> CreateCartAsync(CreateCartCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpDelete("carts/{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> DeleteCartAsync(Guid id)
    {
        await _mediator.Send(new DeleteCartCommand
        {
            CartItemId = id
        });

        return NoContent();
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
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult> DeleteOrderAsync(Guid id)
    {
        await _mediator.Send(new DeleteOrderCommand { Id = id });
        return NoContent();
    }

    #endregion
}