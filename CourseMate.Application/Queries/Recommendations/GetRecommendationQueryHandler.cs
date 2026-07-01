using System.Security.Claims;
using CourseMate.Application.Services.RecommendationServices;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Queries.Recommendations;

public class GetRecommendationQuery : IRequest<RecommendationResponseDto>
{
    public int TopN { get; set; } = 10;

    /// <summary>Optional override — admins / instructors can request recommendations on behalf of a student.</summary>
    public Guid? StudentIdOverride { get; set; }
}

public sealed class GetRecommendationQueryHandler : IRequestHandler<GetRecommendationQuery, RecommendationResponseDto>
{
    private readonly IRecommendationService _recommendationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetRecommendationQueryHandler(
        IRecommendationService recommendationService,
        IHttpContextAccessor httpContextAccessor)
    {
        _recommendationService = recommendationService;
        _httpContextAccessor = httpContextAccessor;
    }

    public Task<RecommendationResponseDto> Handle(GetRecommendationQuery request, CancellationToken cancellationToken)
    {
        Guid studentId;
        if (request.StudentIdOverride.HasValue && request.StudentIdOverride.Value != Guid.Empty)
        {
            ClaimsPrincipal? user = _httpContextAccessor.HttpContext?.User;
            if (user != null && (user.IsInRole(Roles.Admin) || user.IsInRole(Roles.Instructor)))
            {
                studentId = request.StudentIdOverride.Value;
            }
            else
            {
                throw new UnauthorizedAccessException();
            }
        }
        else
        {
            studentId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier) is { } raw
                && Guid.TryParse(raw, out var id)
                    ? id
                    : Guid.Empty;
        }

        return _recommendationService.GetRecommendationsAsync(studentId, request.TopN, cancellationToken);
    }
}
