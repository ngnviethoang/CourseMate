using CourseMate.Application.Commands.Exercises;
using CourseMate.Application.Queries.Exercises;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/exercises")]
[Authorize]
public class ExercisesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ExercisesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor},{Roles.Student}")]
    public async Task<ActionResult> GetListAsync([FromQuery] GetListExercisesQuery request, CancellationToken ct)
    {
        PagedDto<ExerciseDto> result = await _mediator.Send(request, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor},{Roles.Student}")]
    public async Task<ActionResult> GetDetailAsync(Guid id, CancellationToken ct)
    {
        ExerciseDetailDto result = await _mediator.Send(new GetExerciseDetailQuery { Id = id }, ct);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> CreateAsync(CreateExerciseCommand request, CancellationToken ct)
    {
        ResultIdDto result = await _mediator.Send(request, ct);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpdateAsync(Guid id, UpdateExerciseCommand request, CancellationToken ct)
    {
        request.Id = id;
        await _mediator.Send(request, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> DeleteAsync(Guid id, CancellationToken ct)
    {
        await _mediator.Send(new DeleteExerciseCommand { Id = id }, ct);
        return NoContent();
    }

    // ─── Test Cases ─────────────────────────────────────────────────────────────

    [HttpPost("{id:guid}/test-cases")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> AddTestCaseAsync(Guid id, AddTestCaseCommand request, CancellationToken ct)
    {
        request.ExerciseId = id;
        ResultIdDto result = await _mediator.Send(request, ct);
        return Ok(result);
    }

    [HttpPut("{id:guid}/test-cases/{tcId:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpdateTestCaseAsync(Guid id, Guid tcId, UpdateTestCaseCommand request, CancellationToken ct)
    {
        request.Id = tcId;
        await _mediator.Send(request, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}/test-cases/{tcId:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> DeleteTestCaseAsync(Guid id, Guid tcId, CancellationToken ct)
    {
        await _mediator.Send(new DeleteTestCaseCommand { Id = tcId }, ct);
        return NoContent();
    }

    // ─── Default Codes ──────────────────────────────────────────────────────────

    [HttpPost("{id:guid}/default-codes")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpsertDefaultCodeAsync(Guid id, UpsertDefaultCodeCommand request, CancellationToken ct)
    {
        request.ExerciseId = id;
        await _mediator.Send(request, ct);
        return NoContent();
    }
}
