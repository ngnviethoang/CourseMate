using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using CourseMate.Application.Commands.Auth;
using CourseMate.Application.Queries.Auth;
using CourseMate.Application.Services;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Options;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/auth")]
[Authorize]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IGoogleAuthService _googleAuthService;
    private readonly IConfiguration _configuration;
    private readonly UserManager<IdentityUser<Guid>> _userManager;
    private readonly GoogleAuthOptions _googleAuthOptions;

    public AuthController(
        IMediator mediator,
        IGoogleAuthService googleAuthService,
        IConfiguration configuration,
        UserManager<IdentityUser<Guid>> userManager,
        IOptions<GoogleAuthOptions> googleAuthOptions)
    {
        _mediator = mediator;
        _googleAuthService = googleAuthService;
        _configuration = configuration;
        _userManager = userManager;
        _googleAuthOptions = googleAuthOptions.Value;
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

    [HttpPost("verify-email")]
    [AllowAnonymous]
    public async Task<ActionResult> VerifyEmailAsync(VerifyEmailCommand request)
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

    /// <summary>
    /// For multi-role users: select which role to log in with.
    /// Requires the no-role JWT issued during login.
    /// </summary>
    [HttpPost("select-role")]
    public async Task<ActionResult> SelectRoleAsync(SelectRoleCommand request)
    {
        LoginResponse result = await _mediator.Send(request);
        return Ok(result);
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

    /// <summary>
    /// Starts the Google OAuth login flow.
    /// Redirects the browser to Google's authorization page.
    /// </summary>
    [HttpGet("google-login")]
    [AllowAnonymous]
    public ActionResult GoogleLogin()
    {
        string redirectUri = BuildGoogleRedirectUri();
        string state = GenerateOAuthState();

        // Store state in a short-lived cookie for CSRF validation
        Response.Cookies.Append("oauth_state", state, new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            MaxAge = TimeSpan.FromMinutes(10),
            Path = "/"
        });

        string authorizationUrl = _googleAuthService.BuildAuthorizationUrl(redirectUri, state);
        return Redirect(authorizationUrl);
    }

    /// <summary>
    /// Handles the callback from Google after user authorization.
    /// Validates the response, finds or creates the local user,
    /// generates a JWT token, and redirects back to the frontend.
    /// </summary>
    [HttpGet("google-callback")]
    [AllowAnonymous]
    public async Task<ActionResult> GoogleCallbackAsync(
        [FromQuery] string? code,
        [FromQuery] string? state,
        [FromQuery] string? error,
        CancellationToken ct)
    {
        string frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:3000";

        // Handle Google errors (e.g. user denied access)
        if (!string.IsNullOrEmpty(error))
        {
            return Redirect($"{frontendUrl}/google-callback?error={Uri.EscapeDataString(ErrorMessages.GoogleLoginCancelled)}");
        }

        if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
        {
            return Redirect($"{frontendUrl}/google-callback?error={Uri.EscapeDataString(ErrorMessages.GoogleLoginFailed)}");
        }

        // Validate CSRF state
        string? savedState = Request.Cookies["oauth_state"];
        if (string.IsNullOrEmpty(savedState) || savedState != state)
        {
            return Redirect($"{frontendUrl}/google-callback?error={Uri.EscapeDataString(ErrorMessages.InvalidOAuthState)}");
        }

        // Clear the state cookie
        Response.Cookies.Delete("oauth_state");

        try
        {
            string redirectUri = BuildGoogleRedirectUri();
            GoogleUserInfo googleUser = await _googleAuthService.ExchangeCodeForUserInfoAsync(code, redirectUri, ct);

            // Find or create the local user
            IdentityUser<Guid> user = await FindOrCreateUserAsync(googleUser);

            // Get roles
            IList<string> roles = await _userManager.GetRolesAsync(user);

            // If user has no roles, assign Student as default
            if (roles.Count == 0)
            {
                await _userManager.AddToRoleAsync(user, Constants.Roles.Student);
                roles = await _userManager.GetRolesAsync(user);
            }

            // Generate JWT (embed role only if single-role)
            string accessToken = GenerateJwtToken(user, roles.Count == 1 ? roles : []);

            string rolesParam = Uri.EscapeDataString(string.Join(",", roles));
            return Redirect($"{frontendUrl}/google-callback?token={Uri.EscapeDataString(accessToken)}&roles={rolesParam}");
        }
        catch (Exception)
        {
            return Redirect($"{frontendUrl}/google-callback?error={Uri.EscapeDataString(ErrorMessages.GoogleLoginFailed)}");
        }
    }

    #region Private helpers

    private async Task<IdentityUser<Guid>> FindOrCreateUserAsync(GoogleUserInfo googleUser)
    {
        // Try to find user by Google login provider
        IdentityUser<Guid>? user = await _userManager.FindByLoginAsync("Google", googleUser.Id);

        if (user != null)
        {
            return user;
        }

        // Try to find user by email (they may have registered with email/password)
        user = await _userManager.FindByEmailAsync(googleUser.Email);

        if (user != null)
        {
            // Link Google login to existing account
            await _userManager.AddLoginAsync(user, new UserLoginInfo("Google", googleUser.Id, "Google"));
            return user;
        }

        // Create a new user
        string userName = await GenerateUniqueUserNameAsync(googleUser.Name, googleUser.Email);
        user = new IdentityUser<Guid>
        {
            UserName = userName,
            Email = googleUser.Email,
            EmailConfirmed = true // Google already verified the email
        };

        IdentityResult result = await _userManager.CreateAsync(user);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException(
                $"Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        // Link Google login
        await _userManager.AddLoginAsync(user, new UserLoginInfo("Google", googleUser.Id, "Google"));

        return user;
    }

    private async Task<string> GenerateUniqueUserNameAsync(string name, string email)
    {
        // Try using sanitized name first
        string baseName = SanitizeUserName(name);
        if (!string.IsNullOrEmpty(baseName))
        {
            if (await _userManager.FindByNameAsync(baseName) == null)
            {
                return baseName;
            }
        }

        // Fallback to email prefix
        string emailPrefix = email.Split('@')[0];
        baseName = SanitizeUserName(emailPrefix);
        if (!string.IsNullOrEmpty(baseName))
        {
            if (await _userManager.FindByNameAsync(baseName) == null)
            {
                return baseName;
            }
        }

        // Add random suffix
        for (int i = 0; i < 10; i++)
        {
            string candidate = $"{baseName}{Random.Shared.Next(1000, 9999)}";
            if (await _userManager.FindByNameAsync(candidate) == null)
            {
                return candidate;
            }
        }

        return $"user-{Guid.NewGuid():N}"[..20];
    }

    private static string SanitizeUserName(string input)
    {
        const string allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
        return new string(input.Where(c => allowed.Contains(c)).ToArray());
    }

    private string BuildGoogleRedirectUri()
    {
        string scheme = Request.Scheme;
        string host = Request.Host.ToString();
        string callbackPath = _googleAuthOptions.CallbackPath;
        return $"{scheme}://{host}{callbackPath}";
    }

    private static string GenerateOAuthState()
    {
        byte[] bytes = new byte[32];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToBase64String(bytes);
    }

    private string GenerateJwtToken(IdentityUser<Guid> user, IEnumerable<string> roles)
    {
        ICollection<Claim> claims =
        [
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email ?? string.Empty)
        ];

        foreach (string role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        SigningCredentials credentials = new(key, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken token = new(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires: DateTime.Now.AddMinutes(_configuration.GetValue<int>("Jwt:ExpiryMinutes")),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    #endregion
}