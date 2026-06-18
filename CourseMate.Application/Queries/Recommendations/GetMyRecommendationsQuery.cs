using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Recommendations;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Recommendations;

public class GetMyRecommendationsQuery : IRequest<List<RecommendedCourseDto>>
{
    [Range(1, 50)]
    public int Limit { get; set; } = 12;
}

public sealed class GetMyRecommendationsQueryHandler : AbstractQueryHandler<GetMyRecommendationsQuery, List<RecommendedCourseDto>>
{
    private readonly ISender _sender;

    public GetMyRecommendationsQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        ISender sender) : base(dbContext, httpContextAccessor)
    {
        _sender = sender;
    }

    public override async Task<List<RecommendedCourseDto>> Handle(GetMyRecommendationsQuery request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;

        List<RecommendedCourseDto> recommendations = await (
            from recommendation in DbContext.UserRecommendations
            join course in DbContext.Courses on recommendation.CourseId equals course.Id
            join category in DbContext.Categories on course.CategoryId equals category.Id
            where recommendation.UserId == userId && course.IsPublished
            orderby recommendation.Rank
            select new RecommendedCourseDto
            {
                Id = course.Id,
                Title = course.Title,
                ImageUrl = course.ImageUrl,
                Price = course.Price,
                CategoryId = course.CategoryId,
                CategoryName = category.Name,
                Score = recommendation.Score,
                Reason = RecommendationReason.Personalized
            })
            .Take(request.Limit)
            .ToListAsync(ct);

        if (recommendations.Count > 0)
        {
            return recommendations;
        }

        return await _sender.Send(new GetTrendingCoursesQuery { Limit = request.Limit }, ct);
    }
}
