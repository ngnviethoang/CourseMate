using System.Security.Claims;
using CourseMate.Application.Services.RecommendationServices;
using CourseMate.Contracts.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Queries.Recommendations;

public class GetStudentSkillProfileQuery : IRequest<List<StudentSkillProfileDto>>;

public sealed class GetStudentSkillProfileQueryHandler : IRequestHandler<GetStudentSkillProfileQuery, List<StudentSkillProfileDto>>
{
    private readonly IRecommendationService _recommendationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetStudentSkillProfileQueryHandler(IRecommendationService recommendationService, IHttpContextAccessor httpContextAccessor)
    {
        _recommendationService = recommendationService;
        _httpContextAccessor = httpContextAccessor;
    }

    public Task<List<StudentSkillProfileDto>> Handle(GetStudentSkillProfileQuery request, CancellationToken cancellationToken)
    {
        string? raw = _httpContextAccessor.HttpContext?.User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
        Guid studentId = Guid.TryParse(raw, out Guid id) ? id : Guid.Empty;
        return _recommendationService.GetSkillProfileAsync(studentId, cancellationToken);
    }
}
