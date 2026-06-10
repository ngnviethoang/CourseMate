using CourseMate.Application.Commands.Contests;
using CourseMate.Application.Queries.Contests;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.AntiCheat;
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
    public async Task<ActionResult> GetListContests([FromQuery] GetListContestsQuery request)
    {
        PagedDto<ContestDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetContestById(Guid id)
    {
        ContestDto? result = await _mediator.Send(new GetContestByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> CreateContest(CreateContestCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpdateContest(Guid id, UpdateContestCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpPost("{id:guid}/exercises")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> CreateExercise(Guid id, CreateExerciseToContestCommand request)
    {
        request.ContestId = id;
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("{id:guid}/exercises")]
    [Authorize]
    public async Task<ActionResult> GetListExercises(Guid id)
    {
        List<ContestExerciseDto> result = await _mediator.Send(new GetContestExercisesQuery { ContestId = id });
        return Ok(result);
    }

    [HttpDelete("{id:guid}/exercises/{contestExerciseId:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> DeleteExercise(Guid id, Guid contestExerciseId)
    {
        await _mediator.Send(new DeleteExerciseFromContestCommand { ContestId = id, ContestExerciseId = contestExerciseId });
        return NoContent();
    }

    #region Student APIs

    [HttpPost("{id:guid}/register")]
    public async Task<ActionResult> RegisterForContest(Guid id)
    {
        ResultIdDto result = await _mediator.Send(new RegisterForContestCommand { ContestId = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/check-in")]
    public async Task<ActionResult> CheckInContest(Guid id)
    {
        ResultIdDto result = await _mediator.Send(new CheckInContestCommand { ContestId = id });
        return Ok(result);
    }

    [HttpGet("{id:guid}/workspace")]
    public async Task<ActionResult> GetContestWorkspace(Guid id)
    {
        ContestWorkspaceDto? result = await _mediator.Send(new GetContestWorkspaceQuery { ContestId = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/exercises/{exerciseId:guid}/submit")]
    public async Task<ActionResult> SubmitContestExercise(Guid id, Guid exerciseId, [FromBody] SubmitExerciseRequest request)
    {
        SubmitContestExerciseCommand command = new()
        {
            ContestId = id,
            ExerciseId = exerciseId,
            Payload = request
        };
        SubmitExerciseResponse result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("{id:guid}/finish")]
    public async Task<ActionResult> FinishContest(Guid id)
    {
        ResultIdDto result = await _mediator.Send(new FinishContestCommand { ContestId = id });
        return Ok(result);
    }

    [HttpGet("{id:guid}/leaderboard")]
    public async Task<ActionResult> GetContestLeaderboard(Guid id)
    {
        ContestLeaderboardDto? result = await _mediator.Send(new GetContestLeaderboardQuery { ContestId = id });
        return Ok(result);
    }

    #endregion

    #region Anti-Cheat APIs

    [HttpGet("{id:guid}/violations")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> GetContestViolations(Guid id)
    {
        ContestViolationsDto? result = await _mediator.Send(new GetContestViolationsQuery
        {
            ContestId = id,
            IncludeAll = true  // Show all participants so instructor can see the full list
        });
        return Ok(result);
    }

    [HttpGet("{id:guid}/violations/{studentId:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> GetStudentViolations(Guid id, Guid studentId)
    {
        StudentViolationSummaryDto? result = await _mediator.Send(new GetStudentViolationsQuery
        {
            ContestId = id,
            StudentId = studentId
        });
        return Ok(result);
    }

    [HttpGet("{id:guid}/my-violations")]
    [Authorize]
    public async Task<ActionResult> GetMyViolations(Guid id)
    {
        StudentViolationSummaryDto? result = await _mediator.Send(new GetMyContestViolationsQuery
        {
            ContestId = id
        });
        return Ok(result);
    }

    [HttpPost("{id:guid}/disqualify/{studentId:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> DisqualifyStudent(Guid id, Guid studentId, [FromBody] DisqualifyStudentRequest request)
    {
        ResultIdDto result = await _mediator.Send(new DisqualifyStudentCommand
        {
            ContestId = id,
            StudentId = studentId,
            Reason = request.Reason
        });
        return Ok(result);
    }

    [HttpPost("{id:guid}/reinstate/{studentId:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> ReinstateStudent(Guid id, Guid studentId)
    {
        ResultIdDto result = await _mediator.Send(new ReinstateStudentCommand
        {
            ContestId = id,
            StudentId = studentId
        });
        return Ok(result);
    }

    #endregion
}