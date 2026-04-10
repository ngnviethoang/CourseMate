using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Auth;
using CourseMate.Contracts.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Auth;

internal sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, int>
{
    private readonly IUserEmailStore<IdentityUser<Guid>> _emailStore;
    private readonly RoleManager<IdentityUser<Guid>> _roleManager;
    private readonly UserManager<IdentityUser<Guid>> _userManager;
    private readonly IUserStore<IdentityUser<Guid>> _userStore;

    public RegisterCommandHandler(
        UserManager<IdentityUser<Guid>> userManager,
        IUserStore<IdentityUser<Guid>> userStore,
        RoleManager<IdentityUser<Guid>> roleManager)
    {
        _userManager = userManager;
        _userStore = userStore;
        _roleManager = roleManager;
        _emailStore = (IUserEmailStore<IdentityUser<Guid>>)userStore;
    }

    public async Task<int> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        request.Role = request.Role.Trim().ToLowerInvariant();
        if (await _roleManager.RoleExistsAsync(request.Role))
        {
            throw new BusinessException(string.Format(ErrorMessages.RoleNotExists, request.Role));
        }

        IdentityUser<Guid> user = new(request.UserName);
        await _userStore.SetUserNameAsync(user, request.UserName, CancellationToken.None);
        await _emailStore.SetEmailAsync(user, request.Email, CancellationToken.None);
        IdentityResult result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            throw new BusinessException(result.Errors.FirstOrDefault()?.Description ?? string.Empty);
        }

        await _userManager.AddToRoleAsync(user, request.Role);

        // TODO SendConfirmationEmailAsync
        return Codes.Success;
    }
}