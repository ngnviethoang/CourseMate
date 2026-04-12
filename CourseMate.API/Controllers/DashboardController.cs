using CourseMate.Application.Queries.Dashboards;
using CourseMate.Contracts.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult> GetDashboardDataAsync()
    {
        DashboardDto result = await _mediator.Send(new GetDashboardDataQuery());
        return Ok(result);
    }
}