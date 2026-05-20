using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Auth;

public class VerifyEmailCommand : IRequest<int>
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public string Token { get; set; } = string.Empty;
}

internal sealed class VerifyEmailCommandHandler : IRequestHandler<VerifyEmailCommand, int>
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public VerifyEmailCommandHandler(UserManager<IdentityUser<Guid>> userManager)
    {
        _userManager = userManager;
    }

    public async Task<int> Handle(VerifyEmailCommand request, CancellationToken ct)
    {
        IdentityUser<Guid>? user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null)
        {
            throw new BusinessException(ErrorMessages.UserNotFound);
        }

        IdentityResult result = await _userManager.ConfirmEmailAsync(user, request.Token);
        if (!result.Succeeded)
        {
            throw new BusinessException(ErrorMessages.InvalidVerifyToken);
        }

        return Codes.Success;
    }
}
