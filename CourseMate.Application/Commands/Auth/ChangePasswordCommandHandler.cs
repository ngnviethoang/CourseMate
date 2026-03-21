using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Auth;
using CourseMate.Contracts.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace CourseMate.Application.Commands.Auth;

internal sealed class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand>
{
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly SignInManager<IdentityUser<Guid>> _signInManager;
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public ChangePasswordCommandHandler(
        SignInManager<IdentityUser<Guid>> signInManager,
        IConfiguration configuration,
        UserManager<IdentityUser<Guid>> userManager,
        IHttpContextAccessor httpContextAccessor)
    {
        _signInManager = signInManager;
        _configuration = configuration;
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<LoginResponse> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        IdentityUser<Guid>? user = await _userManager.FindByNameAsync(request.UserName);
        if (user == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        IdentityResult changePasswordResult = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
        if (!changePasswordResult.Succeeded)
        {
            return CreateValidationProblem(changePasswordResult);
        }
    }
}