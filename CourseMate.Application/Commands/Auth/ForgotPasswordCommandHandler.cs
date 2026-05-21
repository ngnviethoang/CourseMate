using System.ComponentModel.DataAnnotations;
using CourseMate.Application.BackgroundJobs;
using CourseMate.Contracts.Constants;
using Hangfire;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace CourseMate.Application.Commands.Auth;

public class ForgotPasswordCommand : IRequest<int>
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}

internal sealed class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, int>
{
    private readonly IConfiguration _configuration;
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public ForgotPasswordCommandHandler(
        UserManager<IdentityUser<Guid>> userManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task<int> Handle(ForgotPasswordCommand request, CancellationToken ct)
    {
        IdentityUser<Guid>? user = await _userManager.FindByEmailAsync(request.Email);

        // Always return success to avoid user enumeration attacks
        if (user == null || !await _userManager.IsEmailConfirmedAsync(user))
        {
            return Codes.Success;
        }

        string token = await _userManager.GeneratePasswordResetTokenAsync(user);
        string encodedToken = Uri.EscapeDataString(token);
        string encodedEmail = Uri.EscapeDataString(request.Email);
        string frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:3000";
        string resetUrl = $"{frontendUrl}/reset-password?email={encodedEmail}&token={encodedToken}";

        MimeMessage message = new();
        message.To.Add(MailboxAddress.Parse(request.Email));
        message.Subject = "Đặt lại mật khẩu CourseMate";
        message.Body = new BodyBuilder
        {
            HtmlBody = await RenderResetPasswordTemplate(user.UserName ?? request.Email, resetUrl)
        }.ToMessageBody();

        BackgroundJob.Enqueue<EmailSenderJob>(job => job.Execute(message));
        return Codes.Success;
    }

    private static async Task<string> RenderResetPasswordTemplate(string userName, string resetUrl)
    {
        string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "EmailTemplates", "ResetPassword.html");
        string html = await File.ReadAllTextAsync(templatePath);
        return html
            .Replace("{{userName}}", userName)
            .Replace("{{resetUrl}}", resetUrl);
    }
}