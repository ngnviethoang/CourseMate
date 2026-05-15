using CourseMate.Application.Commands.CodeRunners;
using CourseMate.Application.Queries.CodeRunners;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/code-runner")]
[Authorize]
public class CodeRunner : ControllerBase
{
    private readonly IMediator _mediator;

    public CodeRunner(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult> RunAsync(RunCodeCommand request)
    {
        RunCodeResponse result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult> GetListCompilersAsync()
    {
        IEnumerable<CompilerInfo> result = await _mediator.Send(new GetListCompilersQuery());
        return Ok(result);
    }
}