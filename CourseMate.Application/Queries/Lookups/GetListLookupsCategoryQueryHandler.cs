using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Lookups;

public class GetListLookupsCategoryQuery : IRequest<List<LookupItemDto>>;

public sealed class GetListLookupsCategoryQueryHandler : AbstractQueryHandler<GetListLookupsCategoryQuery, List<LookupItemDto>>
{
    public GetListLookupsCategoryQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<List<LookupItemDto>> Handle(GetListLookupsCategoryQuery request, CancellationToken ct)
    {
        List<LookupItemDto> categories = await DbContext.Categories
            .OrderBy(x => x.Name)
            .Select(x => new LookupItemDto
            {
                Id = x.Id,
                Value = x.Name
            })
            .ToListAsync(ct);

        return categories;
    }
}