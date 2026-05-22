using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Auth;

public class UpdateProfileCommand : IRequest<int>
{
    [EmailAddress]
    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public string? UserName { get; set; }
}

internal sealed class UpdateProfileHandler : AbstractCommandHandler<UpdateProfileCommand, int>
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public UpdateProfileHandler(
        CourseMateDbContext courseMateDbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<IdentityUser<Guid>> userManager
    ) : base(courseMateDbContext, httpContextAccessor)
    {
        _userManager = userManager;
    }

    public override async Task<int> Handle(UpdateProfileCommand request, CancellationToken ct)
    {
        IdentityUser<Guid>? user = await _userManager.FindByIdAsync(CurrentUserId.ToString());

        if (user == null)
        {
            throw new EntityNotFoundException(nameof(IdentityUser), CurrentUserId);
        }

        if (!string.IsNullOrWhiteSpace(request.UserName) && user.UserName != request.UserName)
        {
            user.UserName = request.UserName;
            user.NormalizedUserName = request.UserName.ToUpper();
        }

        if (!string.IsNullOrWhiteSpace(request.Email) && user.Email != request.Email)
        {
            user.Email = request.Email;
            user.NormalizedEmail = request.Email.ToUpper();
            user.EmailConfirmed = false;
        }

        if (!string.IsNullOrWhiteSpace(request.PhoneNumber) && user.PhoneNumber != request.PhoneNumber)
        {
            user.PhoneNumber = request.PhoneNumber;
            user.PhoneNumberConfirmed = false;
        }

        IdentityResult result = await _userManager.UpdateAsync(user);
        if (result.Succeeded)
        {
            return Codes.Success;
        }

        string errors = string.Join(", ", result.Errors.Select(e => e.Description));
        throw new BusinessException(ErrorCode.Unknown, errors);
    }
}