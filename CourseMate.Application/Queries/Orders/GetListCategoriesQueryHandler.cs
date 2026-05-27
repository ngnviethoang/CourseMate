using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Orders;

public class GetListCategoriesQuery : GetListQuery<CategoryDto>;

public sealed class GetListCategoriesQueryHandler : AbstractQueryHandler<GetListCategoriesQuery, PagedDto<CategoryDto>>
{
    public GetListCategoriesQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<CategoryDto>> Handle(GetListCategoriesQuery request, CancellationToken ct)
    {
        bool isFilterGuid = Guid.TryParse(request.Filter, out Guid filterId);

        IQueryable<Category> query = DbContext.Categories
            .WhereIf(isFilterGuid, x => x.Id == filterId)
            .WhereIf(!isFilterGuid && !string.IsNullOrWhiteSpace(request.Filter), x => EF.Functions.ILike(x.Name, $"%{request.Filter}%"));

        int total = await query.CountAsync(ct);

        List<CategoryDto> categories = await query
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(i => new CategoryDto
            {
                Id = i.Id,
                Name = i.Name,
                Description = i.Description,
                IsActive = i.IsActive,
                CreationTime = i.CreationTime,
                LastModificationTime = i.LastModificationTime
            })
            .ToListAsync(ct);

        return new PagedDto<CategoryDto>
        {
            PageSize = request.PageSize,
            PageIndex = request.PageIndex,
            TotalCount = total,
            Items = categories
        };
    }
}