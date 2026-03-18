using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Admins;

internal sealed class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, ResultIdDto>
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public CreateUserCommandHandler(UserManager<IdentityUser<Guid>> userManager)
    {
        _userManager = userManager;
    }

    public async Task<ResultIdDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        IdentityUser<Guid> user = new()
        {
            UserName = request.UserName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber
        };

        IdentityResult result = await _userManager.CreateAsync(user, request.Password);

        if (result.Succeeded)
        {
            return new ResultIdDto { Id = user.Id };
        }

        string errors = string.Join(", ", result.Errors.Select(e => e.Description));
        throw new BusinessException($"{ExceptionMessages.EntityCreationFailed} {errors}");
    }
}