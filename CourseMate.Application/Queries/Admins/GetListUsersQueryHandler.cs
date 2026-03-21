using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetListUsersQueryHandler : AbstractQueryHandler<GetListUsersQuery, PagedDto<UserDto>>
{
    public GetListUsersQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<UserDto>> Handle(GetListUsersQuery request, CancellationToken cancellationToken)
    {
        IQueryable<IdentityUser<Guid>> query = DbContext.Users.AsQueryable();

        if (!string.IsNullOrEmpty(request.Filter))
        {
            query = query.Where(x => x.UserName != null && x.Email != null && (x.UserName.Contains(request.Filter) || x.Email.Contains(request.Filter)));
        }

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