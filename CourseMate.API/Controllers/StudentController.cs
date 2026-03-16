using CourseMate.Contract.Constants;
using CourseMate.Contract.DTOs;
using CourseMate.Contract.DTOs.Admins;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/student")]
[Authorize(Roles = Roles.Student)]
public class StudentController : ControllerBase
{
    private IMediator _mediator;

    public StudentController(IMediator mediator)
    {
        _mediator = mediator;
    }

    #region API Cart

    [HttpGet("carts")]
    public async Task<IActionResult> GetListCartsAsync([FromQuery] GetListCategoriesQuery request)
    {
        PagedDto<CategoryDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("carts/{id:guid}")]
    public async Task<IActionResult> GetCartByIdAsync(Guid id)
    {
        return Ok();
    }

    [HttpPost("carts")]
    public async Task<IActionResult> CreateCartAsync()
    {
        return Ok();
    }

    [HttpPut("carts/{id:guid}")]
    public async Task<IActionResult> UpdateCartAsync(Guid id)
    {
        return Ok();
    }

    [HttpDelete("carts/{id:guid}")]
    public async Task<IActionResult> DeleteCartAsync(Guid id)
    {
        return Ok();
    }

    #endregion
}