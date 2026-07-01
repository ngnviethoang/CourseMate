using CourseMate.Application.Commands.Recommendations;
using CourseMate.Application.Queries.Recommendations;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

/// <summary>
/// REST endpoints exposing the hybrid recommendation engine to the front-end and to admins/instructors.
/// </summary>
[ApiController]
[Route("api/recommendations")]
[Authorize]
public class RecommendationController : ControllerBase
{
    private readonly IMediator _mediator;

    public RecommendationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Returns a personalised batch of recommended courses, contests and exercises for the current student.
    /// Combines content-based, collaborative and weakness-driven signals.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> GetRecommendationsAsync([FromQuery] int topN = 10, [FromQuery] Guid? studentIdOverride = null)
    {
        RecommendationResponseDto result = await _mediator.Send(new GetRecommendationQuery
        {
            TopN = topN,
            StudentIdOverride = studentIdOverride
        });
        return Ok(result);
    }

    /// <summary>
    /// Admins/instructors can preview what a particular student would be recommended.
    /// </summary>
    [HttpGet("preview/{studentId:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> PreviewRecommendationsAsync(Guid studentId, [FromQuery] int topN = 10)
    {
        RecommendationResponseDto result = await _mediator.Send(new GetRecommendationQuery
        {
            TopN = topN,
            StudentIdOverride = studentId
        });
        return Ok(result);
    }

    /// <summary>Read or upsert the current student's preference profile.</summary>
    [HttpGet("preferences")]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> GetPreferenceAsync()
    {
        StudentPreferenceDto? result = await _mediator.Send(new GetStudentPreferenceQuery());
        return Ok(result);
    }

    [HttpPut("preferences")]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> UpsertPreferenceAsync([FromBody] UpsertStudentPreferenceRequest request)
    {
        StudentPreferenceDto result = await _mediator.Send(new UpsertStudentPreferenceCommand { Payload = request });
        return Ok(result);
    }

    /// <summary>Full per-(category, difficulty) skill profile for the current student.</summary>
    [HttpGet("skill-profile")]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> GetSkillProfileAsync()
    {
        List<StudentSkillProfileDto> result = await _mediator.Send(new GetStudentSkillProfileQuery());
        return Ok(result);
    }

    /// <summary>Convenience endpoint: just the weak areas (mastery below threshold).</summary>
    [HttpGet("weak-areas")]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> GetWeakAreasAsync()
    {
        List<StudentSkillProfileDto> result = await _mediator.Send(new GetWeakAreasQuery());
        return Ok(result);
    }

    /// <summary>
    /// Forces a refresh of the skill profile by recomputing every (category, difficulty) bucket
    /// from the student's submission history. Normally scheduled, but exposed for manual refresh.
    /// </summary>
    [HttpPost("skill-profile/rebuild")]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> RebuildSkillProfileAsync()
    {
        int result = await _mediator.Send(new RebuildSkillProfileCommand());
        return Ok(new { refreshed = result });
    }

    // ==================== ANALYTICS ENDPOINTS ====================

    /// <summary>
    /// Record feedback for a recommended course. This helps improve recommendation quality over time.
    /// </summary>
    [HttpPost("{analyticsId:guid}/feedback")]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> RecordFeedbackAsync(Guid analyticsId, [FromBody] RecordFeedbackDto request)
    {
        var service = HttpContext.RequestServices.GetRequiredService<Application.Services.RecommendationServices.IRecommendationAnalyticsService>();
        await service.RecordFeedbackAsync(analyticsId, request.Feedback);
        return Ok(new { success = true });
    }

    /// <summary>
    /// Get all recommendation analytics for the current student (history of recommendations received).
    /// </summary>
    [HttpGet("my-analytics")]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> GetMyAnalyticsAsync()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var service = HttpContext.RequestServices.GetRequiredService<Application.Services.RecommendationServices.IRecommendationAnalyticsService>();
        var result = await service.GetByStudentAsync(userId);
        return Ok(result);
    }

    /// <summary>
    /// Get personal recommendation statistics for the current student.
    /// </summary>
    [HttpGet("my-stats")]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> GetMyStatsAsync()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var service = HttpContext.RequestServices.GetRequiredService<Application.Services.RecommendationServices.IRecommendationAnalyticsService>();
        var result = await service.GetStudentStatsAsync(userId);
        return Ok(result);
    }

    // ==================== ADMIN ANALYTICS ENDPOINTS ====================

    /// <summary>
    /// Get overall recommendation analytics summary. Filterable by date range.
    /// </summary>
    [HttpGet("analytics/summary")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> GetAnalyticsSummaryAsync([FromQuery] DateTimeOffset? from = null, [FromQuery] DateTimeOffset? to = null)
    {
        var service = HttpContext.RequestServices.GetRequiredService<Application.Services.RecommendationServices.IRecommendationAnalyticsService>();
        var result = await service.GetSummaryAsync(from, to);
        return Ok(result);
    }

    /// <summary>
    /// Get top performing courses (by enrollment rate from recommendations).
    /// </summary>
    [HttpGet("analytics/top-courses")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> GetTopCoursesAsync([FromQuery] int top = 10)
    {
        var service = HttpContext.RequestServices.GetRequiredService<Application.Services.RecommendationServices.IRecommendationAnalyticsService>();
        var result = await service.GetTopPerformingCoursesAsync(top);
        return Ok(result);
    }
}
