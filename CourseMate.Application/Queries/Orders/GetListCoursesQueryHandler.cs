using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Orders;

public class GetListCoursesQuery : GetListQuery<CourseDto>;

public sealed class GetListCoursesQueryHandler : AbstractQueryHandler<GetListCoursesQuery, PagedDto<CourseDto>>
{
    public GetListCoursesQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<CourseDto>> Handle(GetListCoursesQuery request, CancellationToken ct)
    {
        IQueryable<CourseDto> query = from course in DbContext.Courses
            join category in DbContext.Categories on course.CategoryId equals category.Id
            join instructor in DbContext.Users on course.InstructorId equals instructor.Id
            select new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Price = course.Price,
                ImageUrl = course.ImageUrl,
                IsPublished = course.IsPublished,
                CategoryId = course.CategoryId,
                CategoryName = category.Name,
                InstructorId = course.InstructorId,
                InstructorName = instructor.UserName,
                CreationTime = course.CreationTime,
                LastModificationTime = course.LastModificationTime
            };

        bool isFilterGuid = Guid.TryParse(request.Filter, out Guid filterId);
        query = query.WhereIf(isFilterGuid, x => x.Id == filterId)
            .WhereIf(!isFilterGuid && !string.IsNullOrWhiteSpace(request.Filter), x => EF.Functions.ILike(x.Title, $"%{request.Filter}%"));

        query = request.Sorting switch
        {
            "title" => query.OrderBy(x => x.Title),
            "title_desc" => query.OrderByDescending(x => x.Title),
            "price" => query.OrderBy(x => x.Price),
            "price_desc" => query.OrderByDescending(x => x.Price),
            "creationTime_desc" => query.OrderByDescending(x => x.CreationTime),
            "lastModificationTime_desc" => query.OrderByDescending(x => x.LastModificationTime),
            _ => query.OrderBy(x => x.CreationTime)
        };

        int total = await query.CountAsync(ct);

        List<CourseDto> courses = await query
            .Paged(request.PageIndex, request.PageSize)
            .ToListAsync(ct);

        return new PagedDto<CourseDto>
        {
            Items = courses,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = total
        };
    }
}