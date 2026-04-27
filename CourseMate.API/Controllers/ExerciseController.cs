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
public class ExerciseController : ControllerBase
{
    private readonly IMediator _mediator;

    public ExerciseController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult> GetListExercisesAsync([FromQuery] GetListExercisesQuery request, CancellationToken ct)
    {
        PagedDto<ExerciseDto> result = await _mediator.Send(request, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetExerciseByIdAsync(Guid id, CancellationToken ct)
    {
        GetExerciseByIdResponse? result = await _mediator.Send(new GetExerciseByIdQuery { Id = id }, ct);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> CreateExerciseAsync(CreateExerciseCommand request, CancellationToken ct)
    {
        ResultIdDto result = await _mediator.Send(request, ct);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpdateExerciseAsync(Guid id, UpdateExerciseCommand request, CancellationToken ct)
    {
        request.Id = id;
        await _mediator.Send(request, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> DeleteExerciseAsync(Guid id, CancellationToken ct)
    {
        await _mediator.Send(new DeleteExerciseCommand { Id = id }, ct);
        return NoContent();
    }

    #region API Default Code

    [HttpPost("{id:guid}/default-codes")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> CreateOrUpdateDefaultCodeAsync(Guid id, CreateOrUpdateDefaultCodeCommand request, CancellationToken ct)
    {
        request.ExerciseId = id;
        await _mediator.Send(request, ct);
        return NoContent();
    }

    #endregion

    #region API Test Case

    [HttpPost("{id:guid}/test-cases")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> CreateTestCaseAsync(Guid id, CreateTestCaseCommand request, CancellationToken ct)
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

    #endregion
}