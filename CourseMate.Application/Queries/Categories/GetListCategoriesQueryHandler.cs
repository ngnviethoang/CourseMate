using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Categories;

public class GetListCategoriesQuery : GetListQuery<CategoryDto>
{
    public bool? HasCourse { get; set; }
}

internal sealed class GetListCategoryQueryHandler : AbstractQueryHandler<GetListCategoriesQuery, PagedDto<CategoryDto>>
{
    public GetListCategoryQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<CategoryDto>> Handle(GetListCategoriesQuery request, CancellationToken ct)
    {
        bool isFilterGuid = Guid.TryParse(request.Filter, out Guid filterId);

        IQueryable<Category> query = DbContext.Categories
            .WhereIf(isFilterGuid, x => x.Id == filterId)
            .WhereIf(!isFilterGuid && !string.IsNullOrWhiteSpace(request.Filter), x => EF.Functions.ILike(x.Name, $"%{request.Filter}%"))
            .WhereIf(request.HasCourse == true, x => DbContext.Courses.Any(c => c.CategoryId == x.Id))
            .WhereIf(request.HasCourse == false, x => !DbContext.Courses.Any(c => c.CategoryId == x.Id));

        query = request.Sorting switch
        {
            "name" => query.OrderBy(x => x.Name),
            "name_desc" => query.OrderByDescending(x => x.Name),
            "creationTime_desc" => query.OrderByDescending(x => x.CreationTime),
            "lastModificationTime" => query.OrderBy(x => x.LastModificationTime),
            "lastModificationTime_desc" => query.OrderByDescending(x => x.LastModificationTime),
            _ => query.OrderBy(x => x.CreationTime)
        };

        int total = await query.CountAsync(ct);

        List<CategoryDto> categories = await query
            .Paged(request.PageIndex, request.PageSize)
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