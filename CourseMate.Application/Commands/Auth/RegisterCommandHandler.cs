using System.ComponentModel.DataAnnotations;
using CourseMate.Application.BackgroundJobs;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using MediatR;
using Microsoft.AspNetCore.Http;
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
    public RegisterRole Role { get; set; }
}

internal sealed class RegisterCommandHandler : AbstractCommandHandler<RegisterCommand, Unit>
{
    private readonly IConfiguration _configuration;
    private readonly IUserEmailStore<User> _emailStore;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly UserManager<User> _userManager;
    private readonly IUserStore<User> _userStore;

    public RegisterCommandHandler(
        CourseMateDbContext courseMateDbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<User> userManager,
        IUserStore<User> userStore,
        RoleManager<IdentityRole<Guid>> roleManager,
        IConfiguration configuration) : base(courseMateDbContext, httpContextAccessor)
    {
        _userManager = userManager;
        _userStore = userStore;
        _roleManager = roleManager;
        _emailStore = (IUserEmailStore<User>)userStore;
        _configuration = configuration;
    }

    public override async Task<Unit> Handle(RegisterCommand request, CancellationToken ct)
    {
        string role = request.Role.ToString();

        // FIX: throw when role does NOT exist (was inverted before)
        if (!await _roleManager.RoleExistsAsync(role))
        {
            throw new BusinessException(ErrorCode.RoleNotExists, string.Format("{0} role does not exist.", role));
        }

        User? existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            IList<string> existingRoles = await _userManager.GetRolesAsync(existingUser);
            bool hasDifferentRole = existingRoles.Any(r => !string.Equals(r, role, StringComparison.OrdinalIgnoreCase));
            if (hasDifferentRole)
            {
                throw new BusinessException(ErrorCode.RoleNotAllowed, "This email is already registered with another role.");
            }

            throw new BusinessException(ErrorCode.RoleNotAllowed, "This email is already registered.");
        }

        User user = new(request.UserName);
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
        string templatePath = Util.ResolveEmailTemplatePath("VerifyEmail.html");
        string html = await File.ReadAllTextAsync(templatePath);
        return html
            .Replace("{{userName}}", userName)
            .Replace("{{verifyUrl}}", verifyUrl);
    }
}