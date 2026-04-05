using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Admins;

internal sealed class RejectInstructorCommandHandler : AbstractCommandHandler<RejectInstructorCommand, int>
{
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public RejectInstructorCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<IdentityUser<Guid>> userManager) : base(dbContext, httpContextAccessor)
    {
        _userManager = userManager;
    }

    public override async Task<int> Handle(RejectInstructorCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.Id.ToString());
        if (user == null)
        {
            throw new BusinessException("User not found.");
        }

        if (await _userManager.IsInRoleAsync(user, Roles.PendingInstructor))
        {
            await _userManager.RemoveFromRoleAsync(user, Roles.PendingInstructor);
        }
        
        if (!await _userManager.IsInRoleAsync(user, Roles.Student))
        {
            await _userManager.AddToRoleAsync(user, Roles.Student);
        }
        
        return Codes.Success;
    }
}
