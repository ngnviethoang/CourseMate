using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.DTOs.Auth;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace CourseMate.Application.Commands.Auth;

internal sealed class ChangePasswordCommandHandler : AbstractCommandHandler<ChangePasswordCommand>
{
    private readonly IConfiguration _configuration;
    private readonly SignInManager<IdentityUser<Guid>> _signInManager;
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public ChangePasswordCommandHandler(
        CourseMateDbContext courseMateDbContext,
        IHttpContextAccessor httpContextAccessor,
        SignInManager<IdentityUser<Guid>> signInManager,
        IConfiguration configuration,
        UserManager<IdentityUser<Guid>> userManager
    ) : base(courseMateDbContext, httpContextAccessor)
    {
        _signInManager = signInManager;
        _configuration = configuration;
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
        if (!changePasswordResult.Succeeded)
        {
            string errors = string.Join(", ", changePasswordResult.Errors.Select(e => e.Description));
            throw new BusinessException(errors);
        }
    }
}