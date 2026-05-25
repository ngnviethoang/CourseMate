using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Auth;

public class GoogleSignInCommand : IRequest<AuthenticationProperties>
{
    [Required]
    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string RedirectUrl { get; set; } = string.Empty;

    public RegisterRole Role { get; set; }
}

internal sealed class StartGoogleSignInCommandHandler : AbstractCommandHandler<GoogleSignInCommand, AuthenticationProperties>
{
    private readonly SignInManager<IdentityUser<Guid>> _signInManager;

    public StartGoogleSignInCommandHandler(
        SignInManager<IdentityUser<Guid>> signInManager,
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
        _signInManager = signInManager;
    }

    public override Task<AuthenticationProperties> Handle(GoogleSignInCommand request, CancellationToken ct)
    {
        HttpRequest httpRequest = HttpContextAccessor.HttpContext!.Request;
        string encodedRedirectUrl = Uri.EscapeDataString(request.RedirectUrl);
        string callbackUrl = $"{httpRequest.Scheme}://{httpRequest.Host}/api/auth/google-callback?redirectUrl={encodedRedirectUrl}";
        const string provider = "Google";
        AuthenticationProperties properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, callbackUrl);
        properties.Items["Role"] = request.Role.ToString();
        return Task.FromResult(properties);
    }
}
