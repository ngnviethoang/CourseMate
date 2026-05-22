using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CourseMate.Application.Commands.Auth;

public class LoginCommand : IRequest<LoginResponse>
{
    [Required]
    [MaxLength(128)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string Password { get; set; } = string.Empty;
}

internal sealed class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IConfiguration _configuration;
    private readonly SignInManager<IdentityUser<Guid>> _signInManager;
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public LoginCommandHandler(
        SignInManager<IdentityUser<Guid>> signInManager,
        IConfiguration configuration,
        UserManager<IdentityUser<Guid>> userManager)
    {
        _signInManager = signInManager;
        _configuration = configuration;
        _userManager = userManager;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken ct)
    {
        // Allow login by username OR email
        IdentityUser<Guid>? user = await _userManager.FindByNameAsync(request.UserName);
        if (user == null)
        {
            user = await _userManager.FindByEmailAsync(request.UserName);
        }

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

        // For single-role users, embed the role in the token directly
        // For multi-role users, return roles list so the client can prompt role selection
        string accessToken = GenerateJwtToken(user, roles.Count == 1 ? roles : []);
        return new LoginResponse
        {
            AccessToken = accessToken,
            Roles = roles.ToList()
        };
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
}