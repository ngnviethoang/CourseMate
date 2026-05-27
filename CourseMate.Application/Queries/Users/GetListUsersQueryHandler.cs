using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Users;

public class GetListUsersQuery : GetListQuery<UserDto>;

public sealed class GetListUsersQueryHandler : AbstractQueryHandler<GetListUsersQuery, PagedDto<UserDto>>
{
    public GetListUsersQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<UserDto>> Handle(GetListUsersQuery request, CancellationToken ct)
    {
        bool isFilterGuid = Guid.TryParse(request.Filter, out Guid filterId);

        IQueryable<User> query = DbContext.Users
            .WhereIf(isFilterGuid, x => x.Id == filterId)
            .WhereIf(!isFilterGuid && !string.IsNullOrWhiteSpace(request.Filter), x =>
                (x.UserName != null && EF.Functions.ILike(x.UserName, $"%{request.Filter}%")) ||
                (x.Email != null && EF.Functions.ILike(x.Email, $"%{request.Filter}%")));

        query = request.Sorting switch
        {
            "userName" => query.OrderBy(x => x.UserName),
            "userName_desc" => query.OrderByDescending(x => x.UserName),
            "email" => query.OrderBy(x => x.Email),
            "email_desc" => query.OrderByDescending(x => x.Email),
            "creationTime" => query.OrderBy(x => x.CreationTime),
            "creationTime_desc" => query.OrderByDescending(x => x.CreationTime),
            "lastModificationTime" => query.OrderBy(x => x.LastModificationTime),
            "lastModificationTime_desc" => query.OrderByDescending(x => x.LastModificationTime),
            _ => query.OrderByDescending(x => x.CreationTime)
        };

        int totalCount = await query.CountAsync(ct);

        List<UserDto> users = await query
            .Paged(request.PageIndex, request.PageSize)
            .Select(x => new UserDto
            {
                Id = x.Id,
                UserName = x.UserName,
                Email = x.Email,
                PhoneNumber = x.PhoneNumber,
                CreationTime = x.CreationTime,
                LastModificationTime = x.LastModificationTime
            })
            .ToListAsync(ct);

        return new PagedDto<UserDto>
        {
            Items = users,
            TotalCount = totalCount,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };
    }
}