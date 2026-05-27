using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Auth;

public class ResetPasswordCommand : IRequest<Unit>
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Token { get; set; } = string.Empty;

    [Required]
    [MaxLength(32)]
    public string NewPassword { get; set; } = string.Empty;
}

public sealed class ResetPasswordCommandHandler : AbstractCommandHandler<ResetPasswordCommand, Unit>
{
    private readonly UserManager<User> _userManager;

    public ResetPasswordCommandHandler(CourseMateDbContext courseMateDbContext,
        IHttpContextAccessor httpContextAccessor, UserManager<User> userManager) : base(courseMateDbContext, httpContextAccessor)
    {
        _userManager = userManager;
    }

    public override async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken ct)
    {
        User? user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            throw new BusinessException(ErrorCode.UserNotFound, "Account not found.");
        }

        IdentityResult result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
        {
            throw new BusinessException(ErrorCode.Unknown, result.Errors.FirstOrDefault()?.Description ?? string.Empty);
        }

        return Unit.Value;
    }
}