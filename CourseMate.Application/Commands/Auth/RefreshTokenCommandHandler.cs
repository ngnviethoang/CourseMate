using CourseMate.Contract.DTOs.Auth;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Auth;

internal sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand>
{
    private readonly SignInManager<IdentityUser<Guid>> _signInManager;

    public RefreshTokenCommandHandler(SignInManager<IdentityUser<Guid>> signInManager)
    {
        _signInManager = signInManager;
    }

    public async Task Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        await _signInManager.SignOutAsync();
    }
}