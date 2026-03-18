using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Admins;

internal sealed class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand>
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public UpdateUserCommandHandler(UserManager<IdentityUser<Guid>> userManager)
    {
        _userManager = userManager;
    }

    public async Task Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        IdentityUser<Guid>? user = await _userManager.FindByIdAsync(request.Id.ToString());

        if (user == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        user.UserName = request.UserName;
        user.Email = request.Email;
        user.PhoneNumber = request.PhoneNumber;

        IdentityResult result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            string errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new BusinessException($"{ExceptionMessages.EntityUpdateFailed} {errors}");
        }
    }
}