using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Users;

public class ApproveInstructorCommand : IRequest<Unit>
{
    public Guid InstructorId { get; set; }
}

public sealed class ApproveInstructorCommandHandler : AbstractCommandHandler<ApproveInstructorCommand, Unit>
{
    private readonly UserManager<User> _userManager;

    public ApproveInstructorCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<User> userManager) : base(dbContext, httpContextAccessor)
    {
        _userManager = userManager;
    }

    public override async Task<Unit> Handle(ApproveInstructorCommand request, CancellationToken ct)
    {
        User? user = await _userManager.FindByIdAsync(request.InstructorId.ToString());

        if (user == null)
        {
            throw new EntityNotFoundException(nameof(User), request.InstructorId);
        }

        IList<string> roles = await _userManager.GetRolesAsync(user);
        if (!roles.Contains("Instructor"))
        {
            throw new BusinessException(ErrorCode.Unknown, "User is not an Instructor.");
        }

        user.IsApproved = true;

        IdentityResult result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            string errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new BusinessException(ErrorCode.Unknown, errors);
        }

        return Unit.Value;
    }
}
