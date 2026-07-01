using System.Security.Claims;
using CourseMate.Application.Services.RecommendationServices;
using CourseMate.Contracts.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Recommendations;

public class UpsertStudentPreferenceCommand : IRequest<StudentPreferenceDto>
{
    public UpsertStudentPreferenceRequest Payload { get; set; } = new();
}

public sealed class UpsertStudentPreferenceCommandHandler : IRequestHandler<UpsertStudentPreferenceCommand, StudentPreferenceDto>
{
    private readonly IRecommendationService _recommendationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UpsertStudentPreferenceCommandHandler(IRecommendationService recommendationService, IHttpContextAccessor httpContextAccessor)
    {
        _recommendationService = recommendationService;
        _httpContextAccessor = httpContextAccessor;
    }

    public Task<StudentPreferenceDto> Handle(UpsertStudentPreferenceCommand request, CancellationToken cancellationToken)
    {
        string? raw = _httpContextAccessor.HttpContext?.User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
        Guid studentId = Guid.TryParse(raw, out Guid id) ? id : Guid.Empty;
        return _recommendationService.UpsertPreferenceAsync(studentId, request.Payload, cancellationToken);
    }
}
