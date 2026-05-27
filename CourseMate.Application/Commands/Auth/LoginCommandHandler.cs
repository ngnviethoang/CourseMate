using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Attributes;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace CourseMate.Application.Commands.Auth;

public class LoginCommand : IRequest<LoginResponse>
{
    [Required]
    [MaxLength(128)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    [SensitiveData]
    public string Password { get; set; } = string.Empty;
}

public sealed class LoginCommandHandler : AbstractCommandHandler<LoginCommand, LoginResponse>
{
    private readonly IConfiguration _configuration;
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;

    public LoginCommandHandler(
        CourseMateDbContext courseMateDbContext,
        IHttpContextAccessor httpContextAccessor,
        SignInManager<User> signInManager,
        IConfiguration configuration,
        UserManager<User> userManager) : base(courseMateDbContext, httpContextAccessor)
    {
        _signInManager = signInManager;
        _configuration = configuration;
        _userManager = userManager;
    }

    public override async Task<LoginResponse> Handle(LoginCommand request, CancellationToken ct)
    {
        // Allow login by username OR email
        User? user = await _userManager.FindByNameAsync(request.UserName) ?? await _userManager.FindByEmailAsync(request.UserName);
        if (user == null)
        {
            throw new BusinessException(ErrorCode.InvalidUsernameOrPassword, "Invalid username or password.");
        }

        // Check email confirmed
        if (!await _userManager.IsEmailConfirmedAsync(user))
        {
            throw new BusinessException(ErrorCode.EmailNotVerified, "This account has not verified its email address.");
        }

        // Check account lockout
        if (await _userManager.IsLockedOutAsync(user))
        {
            throw new BusinessException(ErrorCode.AccountLocked, "This account has been locked.");
        }

        SignInResult result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, true);
        if (!result.Succeeded)
        {
            if (result.IsLockedOut)
            {
                throw new BusinessException(ErrorCode.AccountLocked, "This account has been locked.");
            }

            throw new BusinessException(ErrorCode.InvalidUsernameOrPassword, "Invalid username or password.");
        }

        IList<string> roles = await _userManager.GetRolesAsync(user);

        string accessToken = Util.GenerateJwtToken(
            _configuration,
            user.Id,
            user.UserName ?? string.Empty,
            user.Email ?? string.Empty,
            roles);
        return new LoginResponse
        {
            AccessToken = accessToken
        };
    }
}