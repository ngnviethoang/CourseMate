using CourseMate.Contract.DTOs.Auth;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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

    [Authorize]
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshAsync()
    {
        await _mediator.Send(new LogoutCommand());
        return NoContent();
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> LogoutAsync()
    {
        await _mediator.Send(new LogoutCommand());
        return NoContent();
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmailAsync()
    {
        await _mediator.Send(new LogoutCommand());
        return NoContent();
    }

    [HttpPost("resend-confirm-email")]
    public async Task<IActionResult> ResentConfirmEmailAsync()
    {
        await _mediator.Send(new LogoutCommand());
        return NoContent();
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPasswordAsync()
    {
        await _mediator.Send(new LogoutCommand());
        return NoContent();
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPasswordAsync()
    {
        await _mediator.Send(new LogoutCommand());
        return NoContent();
    }

    [Authorize]
    [HttpPost("mana/info")]
    public async Task<IActionResult> PostManaInfo()
    {
        await _mediator.Send(new LogoutCommand());
        return NoContent();
    }

    [Authorize]
    [HttpGet("mana/info")]
    public async Task<IActionResult> ManaInfo()
    {
        await _mediator.Send(new LogoutCommand());
        return NoContent();
    }
}