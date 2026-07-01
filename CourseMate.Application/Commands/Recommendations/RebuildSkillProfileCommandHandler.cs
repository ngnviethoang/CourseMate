using System.Security.Claims;
using CourseMate.Application.Services.RecommendationServices;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Recommendations;

/// <summary>
/// Forces a refresh of the student's per-(category, difficulty) skill profile.
/// Useful right after a heavy study session or after the student requests "refresh recommendations".
/// </summary>
public class RebuildSkillProfileCommand : IRequest<int>
{
}

public sealed class RebuildSkillProfileCommandHandler : IRequestHandler<RebuildSkillProfileCommand, int>
{
    private readonly IRecommendationService _recommendationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public RebuildSkillProfileCommandHandler(IRecommendationService recommendationService, IHttpContextAccessor httpContextAccessor)
    {
        _recommendationService = recommendationService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<int> Handle(RebuildSkillProfileCommand request, CancellationToken cancellationToken)
    {
        string? raw = _httpContextAccessor.HttpContext?.User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
        Guid studentId = Guid.TryParse(raw, out Guid id) ? id : Guid.Empty;
        int count = await _recommendationService.RebuildSkillProfileAsync(studentId, cancellationToken);
        return count;
    }
}
