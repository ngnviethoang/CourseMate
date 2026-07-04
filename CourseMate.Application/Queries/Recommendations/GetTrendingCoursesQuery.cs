using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Recommendations;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Recommendations;

public class GetTrendingCoursesQuery : IRequest<List<RecommendedCourseDto>>
{
    [Range(1, 50)]
    public int Limit { get; set; } = 12;
}

public sealed class GetTrendingCoursesQueryHandler : AbstractQueryHandler<GetTrendingCoursesQuery, List<RecommendedCourseDto>>
{
    public GetTrendingCoursesQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<List<RecommendedCourseDto>> Handle(GetTrendingCoursesQuery request, CancellationToken ct)
    {
        var enrollmentCounts = await DbContext.Enrollments
            .GroupBy(e => e.CourseId)
            .Select(g => new { CourseId = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        Dictionary<Guid, int> popularity = enrollmentCounts.ToDictionary(x => x.CourseId, x => x.Count);

        List<CourseProjection> courses = await (
                from course in DbContext.Courses
                join category in DbContext.Categories on course.CategoryId equals category.Id
                where course.IsPublished
                select new CourseProjection(course.Id, course.Title, course.ImageUrl, course.Price, course.CategoryId, category.Name))
            .ToListAsync(ct);

        return courses
            .Select(c => new RecommendedCourseDto
            {
                Id = c.Id,
                Title = c.Title,
                ImageUrl = c.ImageUrl,
                Price = c.Price,
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName,
                Score = popularity.GetValueOrDefault(c.Id),
                Reason = RecommendationReason.Popular
            })
            .OrderByDescending(c => c.Score)
            .ThenByDescending(c => c.Id)
            .Take(request.Limit)
            .ToList();
    }

    private sealed record CourseProjection(Guid Id, string Title, string ImageUrl, decimal Price, Guid CategoryId, string CategoryName);
}