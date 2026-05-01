using CourseMate.Application.Commands.Contests;
using CourseMate.Application.Queries.Contests;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.DTOs.Exercises;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/contests")]
[Authorize]
public class ContestController : ControllerBase
{
    private readonly IMediator _mediator;

    public ContestController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult> GetListContestsAsync([FromQuery] GetListContestsQuery request, CancellationToken ct)
    {
        PagedDto<ContestDto> result = await _mediator.Send(request, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetContestByIdAsync(Guid id, CancellationToken ct)
    {
        ContestDto? result = await _mediator.Send(new GetContestByIdQuery { Id = id }, ct);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> CreateContestAsync(CreateContestCommand request, CancellationToken ct)
    {
        ResultIdDto result = await _mediator.Send(request, ct);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpdateContestAsync(Guid id, UpdateContestCommand request, CancellationToken ct)
    {
        request.Id = id;
        await _mediator.Send(request, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/exercises")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> AddExerciseToContestAsync(Guid id, AddExerciseToContestCommand request, CancellationToken ct)
    {
        request.ContestId = id;
        ResultIdDto result = await _mediator.Send(request, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}/exercises")]
    [Authorize]
    public async Task<ActionResult> GetContestExercisesAsync(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetContestExercisesQuery { ContestId = id }, ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}/exercises/{contestExerciseId:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> RemoveExerciseFromContestAsync(Guid id, Guid contestExerciseId, CancellationToken ct)
    {
        await _mediator.Send(new RemoveExerciseFromContestCommand { ContestId = id, ContestExerciseId = contestExerciseId }, ct);
        return NoContent();
    }

    #region Student APIs

    [HttpPost("{id:guid}/register")]
    public async Task<ActionResult> RegisterForContestAsync(Guid id, CancellationToken ct)
    {
        ResultIdDto result = await _mediator.Send(new RegisterForContestCommand { ContestId = id }, ct);
        return Ok(result);
    }

    [HttpPost("{id:guid}/check-in")]
    public async Task<ActionResult> CheckInContestAsync(Guid id, CancellationToken ct)
    {
        ResultIdDto result = await _mediator.Send(new CheckInContestCommand { ContestId = id }, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}/workspace")]
    public async Task<ActionResult> GetContestWorkspaceAsync(Guid id, CancellationToken ct)
    {
        ContestWorkspaceDto? result = await _mediator.Send(new GetContestWorkspaceQuery { ContestId = id }, ct);
        return Ok(result);
    }

    [HttpPost("{id:guid}/exercises/{exerciseId:guid}/submit")]
    public async Task<ActionResult> SubmitContestExerciseAsync(Guid id, Guid exerciseId, [FromBody] SubmitExerciseRequest request)
    {
        SubmitContestExerciseCommand command = new()
        {
            ContestId = id,
            ExerciseId = exerciseId,
            Payload = request
        };
        ResultIdDto result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("{id:guid}/finish")]
    public async Task<ActionResult> FinishContestAsync(Guid id, CancellationToken ct)
    {
        ResultIdDto result = await _mediator.Send(new FinishContestCommand { ContestId = id }, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}/leaderboard")]
    public async Task<ActionResult> GetContestLeaderboardAsync(Guid id, CancellationToken ct)
    {
        ContestLeaderboardDto? result = await _mediator.Send(new GetContestLeaderboardQuery { ContestId = id }, ct);
        return Ok(result);
    }

    #endregion
}
