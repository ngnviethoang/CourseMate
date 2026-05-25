using System.ComponentModel.DataAnnotations;
using CourseMate.Application.BackgroundJobs;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using Hangfire;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace CourseMate.Application.Commands.Auth;

public class RegisterCommand : IRequest<Unit>
{
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(32)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(32)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [MaxLength(32)]
    public string Role { get; set; } = string.Empty;
}

internal sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, Unit>
{
    private readonly IConfiguration _configuration;
    private readonly IUserEmailStore<IdentityUser<Guid>> _emailStore;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly UserManager<IdentityUser<Guid>> _userManager;
    private readonly IUserStore<IdentityUser<Guid>> _userStore;

    public RegisterCommandHandler(
        UserManager<IdentityUser<Guid>> userManager,
        IUserStore<IdentityUser<Guid>> userStore,
        RoleManager<IdentityRole<Guid>> roleManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _userStore = userStore;
        _roleManager = roleManager;
        _emailStore = (IUserEmailStore<IdentityUser<Guid>>)userStore;
        _configuration = configuration;
    }

    public async Task<Unit> Handle(RegisterCommand request, CancellationToken ct)
    {
        string role = request.Role.Trim();

        // FIX: throw when role does NOT exist (was inverted before)
        if (!await _roleManager.RoleExistsAsync(role))
        {
            throw new BusinessException(ErrorCode.RoleNotExists, string.Format("{0} role does not exist.", role));
        }

        IdentityUser<Guid> user = new(request.UserName);
        await _userStore.SetUserNameAsync(user, request.UserName, CancellationToken.None);
        await _emailStore.SetEmailAsync(user, request.Email, CancellationToken.None);

        IdentityResult result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            throw new BusinessException(ErrorCode.Unknown, result.Errors.FirstOrDefault()?.Description ?? string.Empty);
        }

        await _userManager.AddToRoleAsync(user, role);

        // Generate email verification token and send confirmation email
        string token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        string encodedToken = Uri.EscapeDataString(token);
        string frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:3000";
        string verifyUrl = $"{frontendUrl}/verify-email?userId={user.Id}&token={encodedToken}";

        string htmlBody = await RenderVerifyEmailTemplate(request.UserName, verifyUrl);
        BackgroundJob.Enqueue<EmailSenderJob>(job => job.Execute(request.Email, "Xác thực tài khoản CourseMate", htmlBody));
        return Unit.Value;
    }

    private static async Task<string> RenderVerifyEmailTemplate(string userName, string verifyUrl)
    {
        string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "EmailTemplates", "VerifyEmail.html");
        string html = await File.ReadAllTextAsync(templatePath);
        return html
            .Replace("{{userName}}", userName)
            .Replace("{{verifyUrl}}", verifyUrl);
    }
}