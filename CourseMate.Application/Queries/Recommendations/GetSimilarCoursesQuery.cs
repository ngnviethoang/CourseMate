using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Recommendations;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Recommendations;

public class GetSimilarCoursesQuery : IRequest<List<RecommendedCourseDto>>
{
    public Guid CourseId { get; set; }

    [Range(1, 50)]
    public int Limit { get; set; } = 8;
}

public sealed class GetSimilarCoursesQueryHandler : AbstractQueryHandler<GetSimilarCoursesQuery, List<RecommendedCourseDto>>
{
    public GetSimilarCoursesQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<List<RecommendedCourseDto>> Handle(GetSimilarCoursesQuery request, CancellationToken ct)
    {
        return await (
            from similarity in DbContext.CourseSimilarities
            join course in DbContext.Courses on similarity.SimilarCourseId equals course.Id
            join category in DbContext.Categories on course.CategoryId equals category.Id
            where similarity.CourseId == request.CourseId && course.IsPublished
            orderby similarity.Score descending
            select new RecommendedCourseDto
            {
                Id = course.Id,
                Title = course.Title,
                ImageUrl = course.ImageUrl,
                Price = course.Price,
                CategoryId = course.CategoryId,
                CategoryName = category.Name,
                Score = similarity.Score,
                Reason = RecommendationReason.SimilarContent
            })
            .Take(request.Limit)
            .ToListAsync(ct);
    }
}
