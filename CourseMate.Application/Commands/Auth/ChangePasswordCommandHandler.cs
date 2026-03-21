using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Auth;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Auth;

internal sealed class ChangePasswordCommandHandler : AbstractCommandHandler<ChangePasswordCommand>
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public ChangePasswordCommandHandler(
        CourseMateDbContext courseMateDbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<IdentityUser<Guid>> userManager
    ) : base(courseMateDbContext, httpContextAccessor)
    {
        _userManager = userManager;
    }

    public override async Task Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        Guid userId = GetCurrentUserId();
        IdentityUser<Guid>? user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            throw new EntityNotFoundException(nameof(IdentityUser), userId);
        }

        IdentityResult changePasswordResult = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
        if (changePasswordResult.Succeeded)
        {
            return;
        }

        string errors = string.Join(", ", changePasswordResult.Errors.Select(e => e.Description));
        throw new BusinessException(errors);
    }
}