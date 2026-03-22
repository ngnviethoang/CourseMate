using CourseMate.Contracts.DTOs.Auth;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    public async Task<ActionResult> LoginAsync(LoginCommand request)
    {
        LoginResponse result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<ActionResult> RegisterAsync(RegisterCommand request)
    {
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpPost("change-password")]
    public async Task<ActionResult> ChangePasswordAsync(ChangePasswordCommand request)
    {
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpGet("profile")]
    public async Task<ActionResult> GetProfileAsync()
    {
        ProfileDto result = await _mediator.Send(new GetProfileQuery());
        return Ok(result);
    }

    [HttpPost("profile")]
    public async Task<ActionResult> UpdateProfileAsync(UpdateProfileCommand request)
    {
        await _mediator.Send(request);
        return NoContent();
    }
}