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

    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync(RegisterCommand request)
    {
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync(LoginCommand request)
    {
        LoginResponse result = await _mediator.Send(request);
        return Ok(result);
    }
}