using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Users;

public class UpdateUserCommand : IRequest<Unit>
{
    public Guid Id { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;
}

internal sealed class UpdateUserAbstractCommandHandler : AbstractCommandHandler<UpdateUserCommand, Unit>
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public UpdateUserAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<IdentityUser<Guid>> userManager) : base(dbContext, httpContextAccessor)
    {
        _userManager = userManager;
    }

    public override async Task<Unit> Handle(UpdateUserCommand request, CancellationToken ct)
    {
        IdentityUser<Guid>? user = await _userManager.FindByIdAsync(request.Id.ToString());

        if (user == null)
        {
            throw new EntityNotFoundException(nameof(IdentityUser), request.Id);
        }

        user.UserName = request.UserName;
        user.Email = request.Email;
        user.PhoneNumber = request.PhoneNumber;

        IdentityResult result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            string errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new BusinessException(ErrorCode.Unknown, errors);
        }

        return Unit.Value;
    }
}