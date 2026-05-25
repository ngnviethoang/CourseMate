using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Auth;

public class VerifyEmailCommand : IRequest<Unit>
{
    [Required]
    public Guid UserId { get; set; }

    [Required]
    public string Token { get; set; } = string.Empty;
}

internal sealed class VerifyEmailCommandHandler : IRequestHandler<VerifyEmailCommand, Unit>
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public VerifyEmailCommandHandler(UserManager<IdentityUser<Guid>> userManager)
    {
        _userManager = userManager;
    }

    public async Task<Unit> Handle(VerifyEmailCommand request, CancellationToken ct)
    {
        IdentityUser<Guid>? user = await _userManager.FindByIdAsync(request.UserId.ToString());
        if (user == null)
        {
            throw new EntityNotFoundException(nameof(user), request.UserId);
        }

        IdentityResult result = await _userManager.ConfirmEmailAsync(user, request.Token);
        if (!result.Succeeded)
        {
            throw new BusinessException(ErrorCode.Unknown, result.Errors.FirstOrDefault()?.Description ?? string.Empty);
        }

        return Unit.Value;
    }
}