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

public class VerifyEmailCommand : IRequest<Unit>
{
    [Required]
    public Guid UserId { get; set; }

    [Required]
    public string Token { get; set; } = string.Empty;
}

public sealed class VerifyEmailCommandHandler : AbstractCommandHandler<VerifyEmailCommand, Unit>
{
    private readonly UserManager<User> _userManager;

    public VerifyEmailCommandHandler(
        CourseMateDbContext courseMateDbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<User> userManager
    ) : base(courseMateDbContext, httpContextAccessor)
    {
        _userManager = userManager;
    }

    public override async Task<Unit> Handle(VerifyEmailCommand request, CancellationToken ct)
    {
        User? user = await _userManager.FindByIdAsync(request.UserId.ToString());
        if (user == null)
        {
            throw new EntityNotFoundException(nameof(user), request.UserId);
        }

        IdentityResult result = await _userManager.ConfirmEmailAsync(user, request.Token);
        if (!result.Succeeded)
        {
            throw new BusinessException(ErrorCode.Unknown, result.Errors.FirstOrDefault()?.Description ?? string.Empty);
        }

        return Unit.Value;
    }
}