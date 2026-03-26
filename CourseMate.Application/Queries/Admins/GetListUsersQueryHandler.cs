using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.ExtensionMethods;
using Microsoft.AspNetCore.Http;
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
        IQueryable<UserDto> query = DbContext.Users
            .Select(x => new UserDto
            {
                Id = x.Id,
                UserName = x.UserName,
                Email = x.Email,
                PhoneNumber = x.PhoneNumber
            });

        query = query.WhereIf(!string.IsNullOrWhiteSpace(request.Filter), x =>
            (x.UserName != null && EF.Functions.ILike(x.UserName, $"%{request.Filter}%")) ||
            (x.Email != null && EF.Functions.ILike(x.Email, $"%{request.Filter}%")));

        List<UserDto> users = await query
            .Paged(request.PageIndex, request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedDto<UserDto>
        {
            Items = users,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };
    }
}