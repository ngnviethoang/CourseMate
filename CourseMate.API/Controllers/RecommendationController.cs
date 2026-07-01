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
}
