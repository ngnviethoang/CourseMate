using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Courses;

public class GetRecommendedCoursesQuery : IRequest<PagedDto<CourseDto>>
{
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

internal sealed class GetRecommendedCoursesQueryHandler : AbstractQueryHandler<GetRecommendedCoursesQuery, PagedDto<CourseDto>>
{
    public GetRecommendedCoursesQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<CourseDto>> Handle(GetRecommendedCoursesQuery request, CancellationToken ct)
    {
        Guid studentId = CurrentUserId;

        // Step 1: Collect student's purchase history (purchased courses + their categories).
        HashSet<Guid> purchasedCourseIds = await (
            from order in DbContext.Orders
            join item in DbContext.OrderItems on order.Id equals item.OrderId
            where order.StudentId == studentId && order.Status == OrderStatus.Completed
            select item.CourseId
        ).ToHashSetAsync(ct);

        HashSet<Guid> purchasedCategoryIds = await (
            from course in DbContext.Courses
            where purchasedCourseIds.Contains(course.Id)
            select course.CategoryId
        ).ToHashSetAsync(ct);

        // Step 2: Build the candidate query. Popularity is expressed as a *correlated scalar subquery*
        // in the ORDER BY clause so EF Core translates it to a single SQL statement
        // (SELECT COUNT(...) ... WHERE CourseId = c.Id AND Status = 2). This avoids the
        // "GroupBy inside LeftJoin not translatable" failure.
        IQueryable<CourseDto> candidates =
            from course in DbContext.Courses
            join category in DbContext.Categories on course.CategoryId equals category.Id
            join instructor in DbContext.Users on course.InstructorId equals instructor.Id
            where course.IsPublished
                  && !purchasedCourseIds.Contains(course.Id)
            orderby (
                from oi in DbContext.OrderItems
                join o in DbContext.Orders on oi.OrderId equals o.Id
                where oi.CourseId == course.Id && o.Status == OrderStatus.Completed
                select oi.Id
            ).Count() descending,
                course.CreationTime descending
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

        // Step 3: Pull a bounded candidate set ordered by popularity (SQL already sorts it).
        const int candidateLimit = 500;
        List<CourseDto> fetched = await candidates.Take(candidateLimit).ToListAsync(ct);

        // Step 4: Personalize purely in-memory over the bounded set.
        bool hasPersonalSignal = purchasedCategoryIds.Count > 0;
        HashSet<Guid> purchasedCategories = purchasedCategoryIds;

        List<CourseDto> ordered = hasPersonalSignal
            ? fetched
                .OrderByDescending(c => purchasedCategories.Contains(c.CategoryId) ? 1 : 0)
                .ThenByDescending(c => c.CreationTime)
                .ToList()
            : fetched;

        int totalCount = ordered.Count;
        List<CourseDto> page = ordered
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        return new PagedDto<CourseDto>
        {
            Items = page,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };
    }
}