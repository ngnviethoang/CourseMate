using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetListPendingInstructorsQueryHandler : AbstractQueryHandler<GetListPendingInstructorsQuery, PagedDto<UserDto>>
{
    public GetListPendingInstructorsQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<UserDto>> Handle(GetListPendingInstructorsQuery request, CancellationToken cancellationToken)
    {
        // First get the role ID for PendingInstructor
        var pendingRole = await DbContext.Roles.FirstOrDefaultAsync(r => r.Name == Roles.PendingInstructor, cancellationToken);
        if (pendingRole == null)
        {
            return new PagedDto<UserDto> { Items = [], PageIndex = request.PageIndex, PageSize = request.PageSize };
        }

        var pendingUserIds = DbContext.UserRoles.Where(ur => ur.RoleId == pendingRole.Id).Select(ur => ur.UserId);

        IQueryable<IdentityUser<Guid>> query = DbContext.Users.Where(u => pendingUserIds.Contains(u.Id));

        query = query.WhereIf(!string.IsNullOrWhiteSpace(request.Filter), x =>
            (x.UserName != null && EF.Functions.ILike(x.UserName, $"%{request.Filter}%")) ||
            (x.Email != null && EF.Functions.ILike(x.Email, $"%{request.Filter}%")));

        List<UserDto> users = await query
            .Paged(request.PageIndex, request.PageSize)
            .Select(x => new UserDto
            {
                Id = x.Id,
                UserName = x.UserName,
                Email = x.Email,
                PhoneNumber = x.PhoneNumber
            })
            .ToListAsync(cancellationToken);

        return new PagedDto<UserDto>
        {
            Items = users,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };
    }
}
