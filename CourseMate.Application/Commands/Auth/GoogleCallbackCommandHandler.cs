using System.Security.Claims;
using CourseMate.Application.BackgroundJobs;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using Hangfire;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace CourseMate.Application.Commands.Auth;

public class GoogleCallbackCommand : IRequest<Unit>;

internal sealed class GoogleCallbackCommandHandler : AbstractCommandHandler<GoogleCallbackCommand, Unit>
{
    private const string Provider = "Google";
    private readonly IConfiguration _configuration;
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public GoogleCallbackCommandHandler(
        CourseMateDbContext courseMateDbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<IdentityUser<Guid>> userManager,
        IConfiguration configuration
    ) : base(courseMateDbContext, httpContextAccessor)
    {
        _configuration = configuration;
        _userManager = userManager;
    }

    public override async Task<Unit> Handle(GoogleCallbackCommand request, CancellationToken ct)
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

        IdentityUser<Guid>? user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            user = new IdentityUser<Guid>
            {
                Id = Guid.NewGuid(),
                UserName = email,
                Email = email
            };

            IdentityResult createUserResult = await _userManager.CreateAsync(user);
            errors.AddRange(createUserResult.Errors);
        }

        if (!await _userManager.IsInRoleAsync(user, role))
        {
            IdentityResult addRoleResult = await _userManager.AddToRoleAsync(user, role);
            errors.AddRange(addRoleResult.Errors);
        }

        IdentityUser<Guid>? existingLoginUser = await _userManager.FindByLoginAsync(Provider, nameIdentifier);
        if (existingLoginUser == null)
        {
            IdentityResult addLoginResult = await _userManager.AddLoginAsync(user, info);
            errors.AddRange(addLoginResult.Errors);
        }

        if (errors.Any())
        {
            string errorString = string.Join(", ", errors.Select(e => e.Description));
            throw new BusinessException(ErrorCode.Unknown, errorString);
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

        return Unit.Value;
    }

    private static async Task<string> RenderSendConfirmationLinkTemplate(string userName, string confirmationLink)
    {
        string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "EmailTemplates", "SendConfirmationLink.html");
        string html = await File.ReadAllTextAsync(templatePath);
        return html
            .Replace("{{userName}}", userName)
            .Replace("{{confirmationLink}}", confirmationLink);
    }
}