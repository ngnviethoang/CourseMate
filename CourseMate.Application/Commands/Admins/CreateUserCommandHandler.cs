using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Admins;

internal sealed class CreateUserCommandHandler : AbstractCommandHandler<CreateUserCommand, ResultIdDto>
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public CreateUserCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<IdentityUser<Guid>> userManager) : base(dbContext, httpContextAccessor)
    {
        _userManager = userManager;
    }

    public override async Task<ResultIdDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
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
        throw new BusinessException(errors);
    }
}