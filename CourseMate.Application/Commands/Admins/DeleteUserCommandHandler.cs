using CourseMate.Contract.Constants;
using CourseMate.Contract.DTOs.Admins;
using CourseMate.Contract.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Admins;

internal sealed class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand>
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public DeleteUserCommandHandler(UserManager<IdentityUser<Guid>> userManager)
    {
        _userManager = userManager;
    }

    public async Task Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        IdentityUser<Guid>? user = await _userManager.FindByIdAsync(request.Id.ToString());

        if (user == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        IdentityResult result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
        {
            string errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new BusinessException($"{ExceptionMessages.EntityDeletionFailed} {errors}");
        }
    }
}