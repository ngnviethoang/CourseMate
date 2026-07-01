using CourseMate.Application.Commands.Users;
using CourseMate.Application.Queries.Users;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GetUserByIdQuery = CourseMate.Application.Queries.Users.GetUserByIdQuery;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = Roles.Admin)]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult> GetListUserAsync([FromQuery] GetListUsersQuery request)
    {
        PagedDto<UserDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> GetUserByIdAsync(Guid id)
    {
        UserDto? result = await _mediator.Send(new GetUserByIdQuery { Id = id });
        if (result is null)
        {
            return NotFound();
        }
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult> CreateUserAsync(CreateUserCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult> UpdateUserAsync(Guid id, UpdateUserCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult> DeleteUserAsync(Guid id)
    {
        await _mediator.Send(new DeleteUserCommand { Id = id });
        return NoContent();
    }

    [HttpPost("{id:guid}/approve-instructor")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult> ApproveInstructorAsync(Guid id)
    {
        await _mediator.Send(new ApproveInstructorCommand { InstructorId = id });
        return NoContent();
    }

    [HttpPost("{id:guid}/toggle-lock")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult> ToggleLockAsync(Guid id)
    {
        await _mediator.Send(new ToggleUserLockCommand { UserId = id });
        return NoContent();
    }
}