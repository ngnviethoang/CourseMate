using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Categories;

public class GetListCategoriesQuery : GetListQuery<CategoryDto>
{
    public bool? HasCourse { get; set; }
}

public sealed class GetListCategoryQueryHandler : AbstractQueryHandler<GetListCategoriesQuery, PagedDto<CategoryDto>>
{
    public GetListCategoryQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<CategoryDto>> Handle(GetListCategoriesQuery request, CancellationToken ct)
    {
        bool isFilterGuid = Guid.TryParse(request.Filter, out Guid filterId);

        IQueryable<CategoryDto> query = DbContext.Categories
            .WhereIf(isFilterGuid, x => x.Id == filterId)
            .WhereIf(!isFilterGuid && !string.IsNullOrWhiteSpace(request.Filter), x => EF.Functions.ILike(x.Name, $"%{request.Filter}%"))
            .GroupJoin(
                DbContext.Courses,
                category => category.Id,
                course => course.CategoryId,
                (category, courses) => new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    Description = category.Description,
                    IsActive = category.IsActive,
                    CourseCount = courses.Count(),
                    CreationTime = category.CreationTime,
                    LastModificationTime = category.LastModificationTime
                })
            .WhereIf(request.HasCourse == true, x => x.CourseCount > 0)
            .WhereIf(request.HasCourse == false, x => x.CourseCount == 0);

        query = request.Sorting switch
        {
            "name" => query.OrderBy(x => x.Name),
            "name_desc" => query.OrderByDescending(x => x.Name),
            "courseCount" => query.OrderBy(x => x.CourseCount),
            "courseCount_desc" => query.OrderByDescending(x => x.CourseCount),
            "creationTime_desc" => query.OrderByDescending(x => x.CreationTime),
            "lastModificationTime" => query.OrderBy(x => x.LastModificationTime),
            "lastModificationTime_desc" => query.OrderByDescending(x => x.LastModificationTime),
            _ => query.OrderBy(x => x.CreationTime)
        };

        int total = await query.CountAsync(ct);

        List<CategoryDto> categories = await query
            .Paged(request.PageIndex, request.PageSize)
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