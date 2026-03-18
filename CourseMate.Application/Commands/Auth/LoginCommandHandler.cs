using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CourseMate.Contract.Constants;
using CourseMate.Contract.DTOs.Auth;
using CourseMate.Contract.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace CourseMate.Application.Commands.Auth;

internal sealed class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly SignInManager<IdentityUser<Guid>> _signInManager;
    private readonly UserManager<IdentityUser<Guid>> _userManager;
    private readonly IConfiguration _configuration;

    public LoginCommandHandler(
        SignInManager<IdentityUser<Guid>> signInManager,
        IConfiguration configuration,
        UserManager<IdentityUser<Guid>> userManager)
    {
        _signInManager = signInManager;
        _configuration = configuration;
        _userManager = userManager;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        IdentityUser<Guid>? user = await _userManager.FindByNameAsync(request.UserName);
        if (user == null)
        {
            throw new EntityNotFound(ExceptionMessages.EntityNotFound);
        }

        SignInResult result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, true);
        if (!result.Succeeded)
        {
            throw new UnauthorizedAccessException(result.ToString());
        }

        // The signInManager already produced the needed response in the form of a cookie or bearer token.
        return new LoginResponse
        {
            AccessToken = GenerateJwtToken(user),
        };
    }

    private string GenerateJwtToken(IdentityUser<Guid> user)
    {
        IReadOnlyList<Claim> claims =
        [
            new(JwtRegisteredClaimNames.Sub, user.UserName ?? string.Empty),
            new(JwtRegisteredClaimNames.Sid, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty)
        ];

        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        SigningCredentials credentials = new(key, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken token = new(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(_configuration.GetValue<int>("Jwt:ExpiryMinutes")),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}