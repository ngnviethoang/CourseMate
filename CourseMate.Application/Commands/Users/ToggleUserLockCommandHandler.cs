using CourseMate.Application.Shared;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Users;

public class ToggleUserLockCommand : IRequest<Unit>
{
    public Guid UserId { get; set; }
}

public sealed class ToggleUserLockCommandHandler : AbstractCommandHandler<ToggleUserLockCommand, Unit>
{
    private readonly UserManager<User> _userManager;

    public ToggleUserLockCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<User> userManager) : base(dbContext, httpContextAccessor)
    {
        _userManager = userManager;
    }

    public override async Task<Unit> Handle(ToggleUserLockCommand request, CancellationToken ct)
    {
        User? user = await _userManager.FindByIdAsync(request.UserId.ToString());

        if (user == null)
        {
            throw new EntityNotFoundException(nameof(User), request.UserId);
        }

        bool isLocked = await _userManager.IsLockedOutAsync(user);

        if (isLocked)
        {
            await _userManager.SetLockoutEndDateAsync(user, null);
        }
        else
        {
            await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
        }

        return Unit.Value;
    }
}