using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Auth;

public class RegisterCommand : IRequest<int>
{
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string Role { get; set; } = string.Empty;
}

internal sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, int>
{
    private readonly IUserEmailStore<IdentityUser<Guid>> _emailStore;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly UserManager<IdentityUser<Guid>> _userManager;
    private readonly IUserStore<IdentityUser<Guid>> _userStore;

    public RegisterCommandHandler(
        UserManager<IdentityUser<Guid>> userManager,
        IUserStore<IdentityUser<Guid>> userStore,
        RoleManager<IdentityRole<Guid>> roleManager)
    {
        _userManager = userManager;
        _userStore = userStore;
        _roleManager = roleManager;
        _emailStore = (IUserEmailStore<IdentityUser<Guid>>)userStore;
    }

    public async Task<int> Handle(RegisterCommand request, CancellationToken ct)
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