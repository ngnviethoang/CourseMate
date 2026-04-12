using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Auth;

public class ChangePasswordCommand : IRequest<int>
{
    public string NewPassword { get; set; } = string.Empty;

    public string OldPassword { get; set; } = string.Empty;
}

internal sealed class ChangePasswordCommandHandler : AbstractCommandHandler<ChangePasswordCommand, int>
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

    public override async Task<int> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        IdentityUser<Guid>? user = await _userManager.FindByIdAsync(CurrentUserId.ToString());
        if (user == null)
        {
            throw new EntityNotFoundException(nameof(IdentityUser), CurrentUserId);
        }

        IdentityResult changePasswordResult = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
        if (changePasswordResult.Succeeded)
        {
            return Codes.Success;
        }

        string errors = string.Join(", ", changePasswordResult.Errors.Select(e => e.Description));
        throw new BusinessException(errors);
    }
}