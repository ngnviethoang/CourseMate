using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Auth;

public class GetProfileQuery : IRequest<ProfileDto>;

public sealed class GetProfileQueryHandler : AbstractQueryHandler<GetProfileQuery, ProfileDto?>
{
    public GetProfileQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ProfileDto?> Handle(GetProfileQuery request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        User? user = await DbContext.Users.FirstOrDefaultAsync(i => i.Id == userId, ct);

        if (user == null)
        {
            return null;
        }

        List<string> roles = await DbContext.UserRoles
            .Where(r => r.UserId == userId)
            .Join(DbContext.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name!)
            .ToListAsync(ct);

        return new ProfileDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            UserName = user.UserName ?? string.Empty,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            EmailConfirmed = user.EmailConfirmed,
            PhoneNumberConfirmed = user.PhoneNumberConfirmed,
            Roles = roles
        };
    }
}