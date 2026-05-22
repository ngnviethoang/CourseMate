using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Auth;

public class ResetPasswordCommand : IRequest<int>
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Token { get; set; } = string.Empty;

    [Required]
    [MaxLength(32)]
    public string NewPassword { get; set; } = string.Empty;
}

internal sealed class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, int>
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public ResetPasswordCommandHandler(UserManager<IdentityUser<Guid>> userManager)
    {
        _userManager = userManager;
    }

    public async Task<int> Handle(ResetPasswordCommand request, CancellationToken ct)
    {
        IdentityUser<Guid>? user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            throw new BusinessException(ErrorCode.UserNotFound, "Account not found.");
        }

        IdentityResult result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
        {
            throw new BusinessException(ErrorCode.Unknown, result.Errors.FirstOrDefault()?.Description ?? string.Empty);
        }

        return Codes.Success;
    }
}