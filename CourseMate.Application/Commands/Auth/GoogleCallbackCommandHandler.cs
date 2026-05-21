using System.Security.Claims;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
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
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public GoogleCallbackCommandHandler(
        CourseMateDbContext courseMateDbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<IdentityUser<Guid>> userManager,
        SignInManager<IdentityUser<Guid>> signInManager,
        RoleManager<IdentityUser<Guid>> roleManager,
        IConfiguration configuration
    ) : base(courseMateDbContext, httpContextAccessor)
    {
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
            throw new BusinessException("Google login failed.");
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

        if (!errors.Any())
        {
            string errorString = string.Join(", ", errors.Select(e => e.Description));
            throw new BusinessException(errorString);
        }

        /*string code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        await _emailSender.SendConfirmationLinkAsync(user, Input.Email, HtmlEncoder.Default.Encode(callbackUrl));

        // If account confirmation is required, we need to show the link if we don't have a real email sender
        if (_userManager.Options.SignIn.RequireConfirmedAccount)
        {
            return RedirectToPage("./RegisterConfirmation", new { Email = Input.Email });
        }*/

        return Unit.Value;
    }
}