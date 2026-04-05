using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Students;

internal sealed class GetRecommendedCoursesQueryHandler : AbstractQueryHandler<GetRecommendedCoursesQuery, PagedDto<CourseDto>>
{
    public GetRecommendedCoursesQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<CourseDto>> Handle(GetRecommendedCoursesQuery request, CancellationToken cancellationToken)
    {
        Guid? studentId = TryGetCurrentUserId();

        List<Guid> purchasedCourseIds = [];
        List<Guid> purchasedCategoryIds = [];

        // Only fetch purchase history if user is authenticated
        if (studentId.HasValue)
        {
            purchasedCourseIds = await (
                from order in DbContext.Orders
                join orderItem in DbContext.OrderItems on order.Id equals orderItem.OrderId
                where order.StudentId == studentId.Value && order.Status == OrderStatus.Paid
                select orderItem.CourseId
            ).ToListAsync(cancellationToken);

            purchasedCategoryIds = await (
                from course in DbContext.Courses
                where purchasedCourseIds.Contains(course.Id)
                select course.CategoryId
            ).Distinct().ToListAsync(cancellationToken);
        }

        // 2. Query published courses
        IQueryable<CourseDto> query =
            from course in DbContext.Courses
            join category in DbContext.Categories on course.CategoryId equals category.Id
            join instructor in DbContext.Users on course.InstructorId equals instructor.Id
            where course.IsPublished
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

        if (purchasedCourseIds.Count > 0)
        {
            query = query
                .WhereIf(purchasedCategoryIds.Any(), c => purchasedCategoryIds.Contains(c.CategoryId) && !purchasedCourseIds.Contains(c.Id))
                .Where(c => !purchasedCourseIds.Contains(c.Id));
        }

        // 4. Order by popularity (paid enrollment count) and creation time
        IQueryable<CourseDto> finalQuery = query
            .OrderByDescending(c => DbContext.OrderItems
                .Count(oi => oi.CourseId == c.Id && DbContext.Orders
                    .Any(o => o.Id == oi.OrderId && o.Status == OrderStatus.Paid)))
            .ThenByDescending(c => c.CreationTime);

        // 5. Paginate and return
        List<CourseDto> courses = await finalQuery
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        int totalCount = await query.CountAsync(cancellationToken);

        return new PagedDto<CourseDto>
        {
            Items = courses,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };
    }
}