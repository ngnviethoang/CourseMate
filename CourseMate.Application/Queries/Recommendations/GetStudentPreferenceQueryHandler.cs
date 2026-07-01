using System.Security.Claims;
using CourseMate.Application.Services.RecommendationServices;
using CourseMate.Contracts.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Queries.Recommendations;

public class GetStudentPreferenceQuery : IRequest<StudentPreferenceDto?>;

public sealed class GetStudentPreferenceQueryHandler : IRequestHandler<GetStudentPreferenceQuery, StudentPreferenceDto?>
{
    private readonly IRecommendationService _recommendationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetStudentPreferenceQueryHandler(IRecommendationService recommendationService, IHttpContextAccessor httpContextAccessor)
    {
        _recommendationService = recommendationService;
        _httpContextAccessor = httpContextAccessor;
    }

    public Task<StudentPreferenceDto?> Handle(GetStudentPreferenceQuery request, CancellationToken cancellationToken)
    {
        Guid studentId = GetUserId();
        return _recommendationService.GetPreferenceAsync(studentId, cancellationToken);
    }

    private Guid GetUserId()
    {
        string? raw = _httpContextAccessor.HttpContext?.User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
        return Guid.TryParse(raw, out Guid id) ? id : Guid.Empty;
    }
}
