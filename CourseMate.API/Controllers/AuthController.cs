using CourseMate.Application.Commands.Auth;
using CourseMate.Application.Queries.Auth;
using CourseMate.Contracts.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/auth")]
[Authorize]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult> LoginAsync(LoginCommand request)
    {
        LoginResponse result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult> RegisterAsync(RegisterCommand request)
    {
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpGet("verify-email")]
    [AllowAnonymous]
    public async Task<ActionResult> VerifyEmailAsync([FromQuery] VerifyEmailCommand request)
    {
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<ActionResult> ForgotPasswordAsync(ForgotPasswordCommand request)
    {
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<ActionResult> ResetPasswordAsync(ResetPasswordCommand request)
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

    #region Google OAuth

    [HttpGet("signin-google")]
    [AllowAnonymous]
    public async Task<ActionResult> StartGoogleSignIn([FromQuery] GoogleSignInCommand request)
    {
        AuthenticationProperties properties = await _mediator.Send(request);
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    /// <summary>
    ///     Handles the post-authentication redirect after the Google middleware has already completed the OpenID Connect
    ///     handshake.
    /// </summary>
    [HttpGet("google-callback")]
    [AllowAnonymous]
    public async Task<ActionResult> GoogleCallbackAsync([FromQuery] string redirectUrl)
    {
        string callbackRedirectUrl = await _mediator.Send(new GoogleCallbackCommand { RedirectUrl = redirectUrl });
        return Redirect(callbackRedirectUrl);
    }

    #endregion
}
