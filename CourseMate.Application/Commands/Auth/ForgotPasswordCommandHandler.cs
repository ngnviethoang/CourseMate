using System.ComponentModel.DataAnnotations;
using CourseMate.Application.BackgroundJobs;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Attributes;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace CourseMate.Application.Commands.Auth;

public class ForgotPasswordCommand : IRequest<Unit>
{
    [Required]
    [EmailAddress]
    [SensitiveData]
    public string Email { get; set; } = string.Empty;
}

public sealed class ForgotPasswordCommandHandler : AbstractCommandHandler<ForgotPasswordCommand, Unit>
{
    private readonly IConfiguration _configuration;
    private readonly UserManager<User> _userManager;

    public ForgotPasswordCommandHandler(
        CourseMateDbContext courseMateDbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<User> userManager,
        IConfiguration configuration
    ) : base(courseMateDbContext, httpContextAccessor)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    public override async Task<Unit> Handle(ForgotPasswordCommand request, CancellationToken ct)
    {
        User? user = await _userManager.FindByEmailAsync(request.Email);

        // Always return success to avoid user enumeration attacks
        if (user == null || !await _userManager.IsEmailConfirmedAsync(user))
        {
            return Unit.Value;
        }

        string token = await _userManager.GeneratePasswordResetTokenAsync(user);
        string encodedToken = Uri.EscapeDataString(token);
        string encodedEmail = Uri.EscapeDataString(request.Email);
        string frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:3000";
        string resetUrl = $"{frontendUrl}/reset-password?email={encodedEmail}&token={encodedToken}";

        string htmlBody = await RenderResetPasswordTemplate(user.UserName ?? request.Email, resetUrl);
        BackgroundJob.Enqueue<EmailSenderJob>(job => job.Execute(request.Email, "Đặt lại mật khẩu CourseMate", htmlBody));
        return Unit.Value;
    }

    private static async Task<string> RenderResetPasswordTemplate(string userName, string resetUrl)
    {
        string templatePath = Util.ResolveEmailTemplatePath("ResetPassword.html");
        string html = await File.ReadAllTextAsync(templatePath);
        return html
            .Replace("{{userName}}", userName)
            .Replace("{{resetUrl}}", resetUrl);
    }
}