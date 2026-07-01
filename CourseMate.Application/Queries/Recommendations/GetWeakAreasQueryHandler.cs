using System.Security.Claims;
using CourseMate.Application.Services.RecommendationServices;
using CourseMate.Contracts.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Queries.Recommendations;

public class GetWeakAreasQuery : IRequest<List<StudentSkillProfileDto>>;

public sealed class GetWeakAreasQueryHandler : IRequestHandler<GetWeakAreasQuery, List<StudentSkillProfileDto>>
{
    private readonly IRecommendationService _recommendationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetWeakAreasQueryHandler(IRecommendationService recommendationService, IHttpContextAccessor httpContextAccessor)
    {
        _recommendationService = recommendationService;
        _httpContextAccessor = httpContextAccessor;
    }

    public Task<List<StudentSkillProfileDto>> Handle(GetWeakAreasQuery request, CancellationToken cancellationToken)
    {
        string? raw = _httpContextAccessor.HttpContext?.User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
        Guid studentId = Guid.TryParse(raw, out Guid id) ? id : Guid.Empty;
        return _recommendationService.GetWeakAreasAsync(studentId, cancellationToken);
    }
}
