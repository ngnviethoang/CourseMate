using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using CourseMate.Application.BackgroundJobs;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace CourseMate.Application.Commands.Auth;

public class GoogleCallbackCommand : IRequest<string>
{
    [Required]
    public string RedirectUrl { get; set; } = string.Empty;
}

internal sealed class GoogleCallbackCommandHandler : AbstractCommandHandler<GoogleCallbackCommand, string>
{
    private const string Provider = "Google";
    private readonly IConfiguration _configuration;
    private readonly UserManager<User> _userManager;

    public GoogleCallbackCommandHandler(
        CourseMateDbContext courseMateDbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<User> userManager,
        IConfiguration configuration
    ) : base(courseMateDbContext, httpContextAccessor)
    {
        _configuration = configuration;
        _userManager = userManager;
    }

    public override async Task<string> Handle(GoogleCallbackCommand request, CancellationToken ct)
    {
        AuthenticateResult auth = await HttpContextAccessor.HttpContext!.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        ClaimsPrincipal? principal = auth.Principal;
        string? nameIdentifier = principal?.FindFirstValue(ClaimTypes.NameIdentifier);
        string? email = principal?.FindFirstValue(ClaimTypes.Email);
        string? role = auth.Properties?.Items["Role"];

        if (principal == null || string.IsNullOrWhiteSpace(nameIdentifier) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(role))
        {
            throw new BusinessException(ErrorCode.GoogleLoginFailed, "Google login failed.");
        }

        List<IdentityError> errors = [];

        ExternalLoginInfo info = new(principal, Provider, nameIdentifier, Provider)
        {
            AuthenticationTokens = auth.Properties?.GetTokens(),
            AuthenticationProperties = auth.Properties
        };

        User? user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                UserName = email,
                Email = email
            };

            IdentityResult createUserResult = await _userManager.CreateAsync(user);
            errors.AddRange(createUserResult.Errors);
        }
        else
        {
            IList<string> existingRoles = await _userManager.GetRolesAsync(user);
            bool hasDifferentRole = existingRoles.Any(r => !string.Equals(r, role, StringComparison.OrdinalIgnoreCase));
            if (hasDifferentRole)
            {
                throw new BusinessException(ErrorCode.RoleNotAllowed, "This email is already registered with another role.");
            }
        }

        if (!await _userManager.IsInRoleAsync(user, role))
        {
            IdentityResult addRoleResult = await _userManager.AddToRoleAsync(user, role);
            errors.AddRange(addRoleResult.Errors);
        }

        User? existingLoginUser = await _userManager.FindByLoginAsync(Provider, nameIdentifier);
        if (existingLoginUser == null)
        {
            IdentityResult addLoginResult = await _userManager.AddLoginAsync(user, info);
            errors.AddRange(addLoginResult.Errors);
        }

        if (errors.Any())
        {
            string errorString = string.Join(", ", errors.Select(e => e.Description));
            throw new BusinessException(ErrorCode.GoogleLoginFailed, errorString);
        }

        bool requireConfirmedAccount = _userManager.Options.SignIn.RequireConfirmedAccount;
        if (requireConfirmedAccount && !user.EmailConfirmed && !string.IsNullOrWhiteSpace(user.Email))
        {
            string token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            string encodedToken = Uri.EscapeDataString(token);
            string frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:3000";
            string confirmationLink = $"{frontendUrl}/verify-email?userId={user.Id}&token={encodedToken}";

            string htmlBody = await RenderSendConfirmationLinkTemplate(user.UserName ?? user.Email, confirmationLink);
            BackgroundJob.Enqueue<EmailSenderJob>(job => job.Execute(user.Email, "Xác thực tài khoản CourseMate", htmlBody));
        }

        string accessToken = Util.GenerateJwtToken(
            _configuration,
            user.Id,
            user.UserName ?? string.Empty,
            user.Email ?? string.Empty,
            [role]);
        return BuildRedirectUrlWithToken(request.RedirectUrl, accessToken);
    }

    private static async Task<string> RenderSendConfirmationLinkTemplate(string userName, string confirmationLink)
    {
        string templatePath = Util.ResolveEmailTemplatePath("SendConfirmationLink.html");
        string html = await File.ReadAllTextAsync(templatePath);
        return html
            .Replace("{{userName}}", userName)
            .Replace("{{confirmationLink}}", confirmationLink);
    }

    private static string BuildRedirectUrlWithToken(string redirectUrl, string accessToken)
    {
        if (!Uri.TryCreate(redirectUrl, UriKind.Absolute, out _))
        {
            throw new BusinessException(ErrorCode.InvalidOAuthState, "Invalid redirect URL.");
        }

        UriBuilder builder = new(redirectUrl);
        string currentFragment = builder.Fragment.TrimStart('#');
        string tokenFragment = $"accessToken={Uri.EscapeDataString(accessToken)}";
        builder.Fragment = string.IsNullOrWhiteSpace(currentFragment) ? tokenFragment : $"{currentFragment}&{tokenFragment}";
        return builder.Uri.ToString();
    }
}