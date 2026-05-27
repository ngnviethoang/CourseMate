using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Lookups;

public class GetListLookupsUserQuery : IRequest<List<LookupItemDto>>
{
    public List<string> Roles { get; set; } = [];
}

public sealed class GetListLookupsUserQueryHandler : AbstractQueryHandler<GetListLookupsUserQuery, List<LookupItemDto>>
{
    public GetListLookupsUserQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<List<LookupItemDto>> Handle(GetListLookupsUserQuery request, CancellationToken ct)
    {
        List<string> roles = request.Roles
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => x.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        List<LookupItemDto> users = await (
            from user in DbContext.Users
            join userRole in DbContext.UserRoles on user.Id equals userRole.UserId
            join role in DbContext.Roles on userRole.RoleId equals role.Id
            where user.UserName != null
            where roles.Count > 0 && role.Name != null && roles.Contains(role.Name)
            select new LookupItemDto
            {
                Id = user.Id,
                Value = user.UserName!
            }).ToListAsync(ct);

        return users;
    }
}