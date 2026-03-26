using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetListCategoryQueryHandler : AbstractQueryHandler<GetListCategoriesQuery, PagedDto<CategoryDto>>
{
    public GetListCategoryQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<CategoryDto>> Handle(GetListCategoriesQuery request, CancellationToken cancellationToken)
    {
        IQueryable<CategoryDto> query = DbContext.Categories.Select(i => new CategoryDto
        {
            Id = i.Id,
            Name = i.Name,
            Description = i.Description,
            IsActive = i.IsActive,
            CreationTime = i.CreationTime,
            LastModificationTime = i.LastModificationTime
        });

        query = query.WhereIf(!string.IsNullOrWhiteSpace(request.Filter), x => EF.Functions.ILike(x.Name, $"%{request.Filter}%"));

        query = request.Sorting switch
        {
            "name" => query.OrderBy(x => x.Name),
            "name_desc" => query.OrderByDescending(x => x.Name),
            "creationTime_desc" => query.OrderByDescending(x => x.CreationTime),
            "lastModificationTime" => query.OrderBy(x => x.LastModificationTime),
            "lastModificationTime_desc" => query.OrderByDescending(x => x.LastModificationTime),
            _ => query.OrderBy(x => x.CreationTime)
        };

        int total = await query.CountAsync(cancellationToken);

        List<CategoryDto> categories = await query
            .Paged(request.PageIndex, request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedDto<CategoryDto>
        {
            PageSize = request.PageSize,
            PageIndex = request.PageIndex,
            TotalCount = total,
            Items = categories
        };
    }
}