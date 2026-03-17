using CourseMate.Contract.DTOs;
using CourseMate.Contract.DTOs.Admins;
using CourseMate.Core;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetListUsersQueryHandler : IRequestHandler<GetListUsersQuery, PagedDto<UserDto>>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;

    public GetListUsersQueryHandler(CourseMateReadOnlyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedDto<UserDto>> Handle(GetListUsersQuery request, CancellationToken cancellationToken)
    {
        IQueryable<IdentityUser<Guid>> query = _dbContext.Users.AsQueryable();

        if (!string.IsNullOrEmpty(request.Filter))
        {
            query = query.Where(x => x.UserName != null && x.Email != null && (x.UserName.Contains(request.Filter) || x.Email.Contains(request.Filter)));
        }

        List<UserDto> users = await query
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize)
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