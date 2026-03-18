using CourseMate.Contract.DTOs.Auth;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Auth;

internal sealed class LogoutCommandHandler : IRequestHandler<LogoutCommand>
{
    private readonly SignInManager<IdentityUser<Guid>> _signInManager;

    public LogoutCommandHandler(SignInManager<IdentityUser<Guid>> signInManager)
    {
        _signInManager = signInManager;
    }

    public async Task Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        await _signInManager.SignOutAsync();
    }
}