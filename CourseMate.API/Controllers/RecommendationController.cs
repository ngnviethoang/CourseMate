using CourseMate.Application.Queries.Recommendations;
using CourseMate.Contracts.DTOs.Recommendations;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/recommendations")]
public class RecommendationController : ControllerBase
{
    private readonly IMediator _mediator;

    public RecommendationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("for-me")]
    [Authorize]
    public async Task<ActionResult> GetListMyRecommendations([FromQuery] GetMyRecommendationsQuery request)
    {
        List<RecommendedCourseDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("trending")]
    [AllowAnonymous]
    public async Task<ActionResult> GetListTrendingCourses([FromQuery] GetTrendingCoursesQuery request)
    {
        List<RecommendedCourseDto> result = await _mediator.Send(request);
        return Ok(result);
    }
}