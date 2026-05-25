using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Users;

public class DeleteUserCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}

internal sealed class DeleteUserAbstractCommandHandler : AbstractCommandHandler<DeleteUserCommand, Unit>
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public DeleteUserAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<IdentityUser<Guid>> userManager) : base(dbContext, httpContextAccessor)
    {
        _userManager = userManager;
    }

    public override async Task<Unit> Handle(DeleteUserCommand request, CancellationToken ct)
    {
        IdentityUser<Guid>? user = await _userManager.FindByIdAsync(request.Id.ToString());
        if (user == null)
        {
            return Unit.Value;
        }

        IdentityResult result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            string errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new BusinessException(ErrorCode.Unknown, errors);
        }

        return Unit.Value;
    }
}