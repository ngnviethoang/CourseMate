using CourseMate.Application.Queries.Lookups;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/lookups")]
[Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
public class LookupController : ControllerBase
{
    private readonly IMediator _mediator;

    public LookupController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("categories")]
    public async Task<ActionResult> LookupsCategoryAsync()
    {
        List<LookupItemDto> result = await _mediator.Send(new GetListLookupsCategoryQuery());
        return Ok(result);
    }

    [HttpGet("users")]
    public async Task<ActionResult> LookupsUserAsync([FromQuery] GetListLookupsUserQuery request)
    {
        List<LookupItemDto> result = await _mediator.Send(request);
        return Ok(result);
    }
}