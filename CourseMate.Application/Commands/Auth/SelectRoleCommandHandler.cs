using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CourseMate.Application.Commands.Auth;

public class SelectRoleCommand : IRequest<LoginResponse>
{
    [Required]
    public string Role { get; set; } = string.Empty;
}

internal sealed class SelectRoleCommandHandler : IRequestHandler<SelectRoleCommand, LoginResponse>
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IConfiguration _configuration;

    public SelectRoleCommandHandler(
        UserManager<IdentityUser<Guid>> userManager,
        IHttpContextAccessor httpContextAccessor,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _configuration = configuration;
    }

    public async Task<LoginResponse> Handle(SelectRoleCommand request, CancellationToken ct)
    {
        string? userIdStr = _httpContextAccessor.HttpContext?.User
            .FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out Guid userId))
        {
            throw new BusinessException(ErrorMessages.UserNotFound);
        }

        IdentityUser<Guid>? user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            throw new BusinessException(ErrorMessages.UserNotFound);
        }

        // Verify the user actually has this role
        IList<string> userRoles = await _userManager.GetRolesAsync(user);
        string selectedRole = request.Role.Trim();
        if (!userRoles.Contains(selectedRole, StringComparer.OrdinalIgnoreCase))
        {
            throw new BusinessException(ErrorMessages.RoleNotAllowed);
        }

        string accessToken = GenerateJwtToken(user, [selectedRole]);
        return new LoginResponse
        {
            AccessToken = accessToken,
            Roles = userRoles.ToList()
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
