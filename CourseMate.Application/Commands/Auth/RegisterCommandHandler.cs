using CourseMate.Contracts.DTOs.Auth;
using CourseMate.Contracts.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Auth;

internal sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand>
{
    private readonly IUserEmailStore<IdentityUser<Guid>> _emailStore;
    private readonly UserManager<IdentityUser<Guid>> _userManager;
    private readonly IUserStore<IdentityUser<Guid>> _userStore;

    public RegisterCommandHandler(
        UserManager<IdentityUser<Guid>> userManager,
        IUserStore<IdentityUser<Guid>> userStore)
    {
        _userManager = userManager;
        _userStore = userStore;
        _emailStore = (IUserEmailStore<IdentityUser<Guid>>)userStore;
    }

    public async Task Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        IdentityUser<Guid> user = new(request.UserName);
        await _userStore.SetUserNameAsync(user, request.UserName, CancellationToken.None);
        await _emailStore.SetEmailAsync(user, request.Email, CancellationToken.None);
        IdentityResult result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            throw new BusinessException(result.Errors.FirstOrDefault()?.Description ?? string.Empty);
        }

        await _userManager.AddToRoleAsync(user, request.Role.ToString());

        // TODO SendConfirmationEmailAsync
    }
}