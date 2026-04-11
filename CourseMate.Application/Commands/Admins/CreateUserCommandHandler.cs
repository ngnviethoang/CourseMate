using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Application.Commands.Admins;

public class CreateUserCommand : IRequest<ResultIdDto>
{
    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty;
}

internal sealed class CreateUserCommandHandler : AbstractCommandHandler<CreateUserCommand, ResultIdDto>
{
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly UserManager<IdentityUser<Guid>> _userManager;

    public CreateUserCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        UserManager<IdentityUser<Guid>> userManager,
        RoleManager<IdentityRole<Guid>> roleManager
    ) : base(dbContext, httpContextAccessor)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public override async Task<ResultIdDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        request.Role = request.Role.Trim().ToLowerInvariant();
        if (await _roleManager.RoleExistsAsync(request.Role))
        {
            throw new BusinessException(string.Format(ErrorMessages.RoleNotExists, request.Role));
        }

        IdentityUser<Guid> user = new()
        {
            UserName = request.UserName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber
        };

        IdentityResult result = await _userManager.CreateAsync(user, request.Password);

        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, request.Role);
            return new ResultIdDto { Id = user.Id };
        }

        string errors = string.Join(", ", result.Errors.Select(e => e.Description));
        throw new BusinessException(errors);
    }
}